"""Knowledge graph edge generation service.

Auto-generates edges between knowledge nodes based on relationships:
- CONTAINS_KANJI: vocabulary → kanji (extracted from surface_form)
- HAS_READING: vocabulary/grammar → reading nodes
- PREREQUISITE_OF: N5 → N4 progression
- APPEARS_IN_LEVEL: KP → level metadata
- CROSS_LANGUAGE_EQUIVALENT: manual cross-language links
"""

from __future__ import annotations

import logging
from decimal import Decimal
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.knowledge_point import KnowledgePoint
from app.models.knowledge_graph import KnowledgeNode, KnowledgeEdge

try:
    from app.nlp.kanji import extract_kanji
except ImportError:
    def extract_kanji(text: str) -> list[str]:
        """Fallback: extract CJK characters when NLP libs unavailable."""
        import re
        return list(set(re.findall(r'[\u4e00-\u9fff]', text)))

logger = logging.getLogger(__name__)


async def _get_node_by_kp_id(db: AsyncSession, kp_id) -> KnowledgeNode | None:
    """Get a graph node by its knowledge_point_id."""
    stmt = select(KnowledgeNode).where(KnowledgeNode.knowledge_point_id == kp_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def _edge_exists(
    db: AsyncSession,
    source_id,
    target_id,
    edge_type: str,
) -> bool:
    """Check if an edge already exists between two nodes."""
    stmt = select(KnowledgeEdge).where(
        KnowledgeEdge.source_node_id == source_id,
        KnowledgeEdge.target_node_id == target_id,
        KnowledgeEdge.edge_type == edge_type,
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none() is not None


async def generate_containment_edges(db: AsyncSession) -> dict[str, Any]:
    """Generate CONTAINS_KANJI edges: vocabulary → kanji.

    For each Japanese vocabulary item, extract kanji from the surface form
    and create edges to the corresponding kanji knowledge nodes.
    """
    # Load all Japanese vocabulary KPs
    vocab_stmt = select(KnowledgePoint).where(
        KnowledgePoint.target_language == "ja",
        KnowledgePoint.type == "vocabulary",
        KnowledgePoint.deleted_at.is_(None),
    )
    vocab_result = await db.execute(vocab_stmt)
    vocab_kps = vocab_result.scalars().all()

    # Load all kanji KPs indexed by character
    kanji_stmt = select(KnowledgePoint).where(
        KnowledgePoint.target_language == "ja",
        KnowledgePoint.type == "kanji",
        KnowledgePoint.deleted_at.is_(None),
    )
    kanji_result = await db.execute(kanji_stmt)
    kanji_map: dict[str, KnowledgePoint] = {}
    for kp in kanji_result.scalars().all():
        kanji_map[kp.surface_form] = kp

    created = 0
    skipped = 0

    for vocab_kp in vocab_kps:
        kanji_chars = extract_kanji(vocab_kp.surface_form)
        if not kanji_chars:
            continue

        vocab_node = await _get_node_by_kp_id(db, vocab_kp.id)
        if not vocab_node:
            continue

        for char in kanji_chars:
            kanji_kp = kanji_map.get(char)
            if not kanji_kp:
                continue

            kanji_node = await _get_node_by_kp_id(db, kanji_kp.id)
            if not kanji_node:
                continue

            if await _edge_exists(db, vocab_node.id, kanji_node.id, "CONTAINS_KANJI"):
                skipped += 1
                continue

            edge = KnowledgeEdge(
                source_node_id=vocab_node.id,
                target_node_id=kanji_node.id,
                edge_type="CONTAINS_KANJI",
                weight=Decimal("1.00"),
                metadata_={"character": char},
            )
            db.add(edge)
            created += 1

    await db.flush()
    logger.info(f"CONTAINS_KANJI edges: {created} created, {skipped} skipped")
    return {"created": created, "skipped": skipped, "edge_type": "CONTAINS_KANJI"}


async def generate_level_edges(db: AsyncSession) -> dict[str, Any]:
    """Generate PREREQUISITE_OF edges for both JLPT and IELTS levels.

    JLPT: N5 → N4 → N3 progression (same surface_form)
    IELTS: Band 4.0 → 5.0 → 5.5 → 6.0 → 6.5 → 7.0 progression
    """
    created = 0

    # JLPT level edges (Japanese)
    created += await _generate_level_edges_for_language(db, "ja", {"N5": 0, "N4": 1, "N3": 2, "N2": 3, "N1": 4})

    # IELTS level edges (English)
    created += await _generate_level_edges_for_language(
        db, "en", {"4.0": 0, "4.5": 1, "5.0": 2, "5.5": 3, "6.0": 4, "6.5": 5, "7.0": 6}
    )

    logger.info(f"PREREQUISITE_OF edges: {created} created total")
    return {"created": created, "edge_type": "PREREQUISITE_OF"}


async def _generate_level_edges_for_language(
    db: AsyncSession,
    target_language: str,
    level_order: dict[str, int],
) -> int:
    """Generate PREREQUISITE_OF edges for a specific language and level system."""
    stmt = select(KnowledgePoint).where(
        KnowledgePoint.target_language == target_language,
        KnowledgePoint.deleted_at.is_(None),
    ).order_by(KnowledgePoint.type, KnowledgePoint.proficiency_level)

    result = await db.execute(stmt)
    kps = result.scalars().all()

    groups: dict[str, list[KnowledgePoint]] = {}
    for kp in kps:
        key = f"{kp.type}:{kp.surface_form}"
        groups.setdefault(key, []).append(kp)

    created = 0

    for key, group in groups.items():
        if len(group) < 2:
            continue

        sorted_group = sorted(group, key=lambda k: level_order.get(k.proficiency_level, 99))
        for i in range(len(sorted_group) - 1):
            lower = sorted_group[i]
            higher = sorted_group[i + 1]

            lower_node = await _get_node_by_kp_id(db, lower.id)
            higher_node = await _get_node_by_kp_id(db, higher.id)
            if not lower_node or not higher_node:
                continue

            if await _edge_exists(db, lower_node.id, higher_node.id, "PREREQUISITE_OF"):
                continue

            edge = KnowledgeEdge(
                source_node_id=lower_node.id,
                target_node_id=higher_node.id,
                edge_type="PREREQUISITE_OF",
                weight=Decimal("0.80"),
            )
            db.add(edge)
            created += 1

    logger.info(f"PREREQUISITE_OF edges for {target_language}: {created} created")
    await db.flush()
    return created


async def generate_related_edges(db: AsyncSession) -> dict[str, Any]:
    """Generate RELATED_TO edges between KPs.

    Japanese: links vocabulary sharing kanji characters
    English: links vocabulary sharing word families (by stem/lemma)
    """
    created = 0

    # Japanese: shared kanji
    created += await _generate_related_edges_ja(db)

    # English: shared word families
    created += await _generate_related_edges_en(db)

    await db.flush()
    logger.info(f"RELATED_TO edges: {created} created total")
    return {"created": created, "edge_type": "RELATED_TO"}


async def _generate_related_edges_ja(db: AsyncSession) -> int:
    """Generate RELATED_TO edges for Japanese vocabulary sharing kanji."""
    stmt = select(KnowledgePoint).where(
        KnowledgePoint.target_language == "ja",
        KnowledgePoint.type == "vocabulary",
        KnowledgePoint.deleted_at.is_(None),
    )
    result = await db.execute(stmt)
    vocab_kps = result.scalars().all()

    kanji_to_vocab: dict[str, list[KnowledgePoint]] = {}
    for kp in vocab_kps:
        chars = extract_kanji(kp.surface_form)
        for ch in chars:
            kanji_to_vocab.setdefault(ch, []).append(kp)

    created = 0
    seen_pairs: set[tuple] = set()

    for ch, kp_list in kanji_to_vocab.items():
        if len(kp_list) < 2:
            continue

        for i in range(min(len(kp_list), 10)):
            for j in range(i + 1, min(len(kp_list), 10)):
                pair = (min(kp_list[i].id, kp_list[j].id), max(kp_list[i].id, kp_list[j].id))
                if pair in seen_pairs:
                    continue
                seen_pairs.add(pair)

                node_a = await _get_node_by_kp_id(db, kp_list[i].id)
                node_b = await _get_node_by_kp_id(db, kp_list[j].id)
                if not node_a or not node_b:
                    continue

                if await _edge_exists(db, node_a.id, node_b.id, "RELATED_TO"):
                    continue

                edge = KnowledgeEdge(
                    source_node_id=node_a.id,
                    target_node_id=node_b.id,
                    edge_type="RELATED_TO",
                    weight=Decimal("0.50"),
                    metadata_={"shared_kanji": ch},
                )
                db.add(edge)
                created += 1

    logger.info(f"RELATED_TO edges (ja): {created} created")
    return created


async def _generate_related_edges_en(db: AsyncSession) -> int:
    """Generate RELATED_TO edges for English vocabulary sharing word roots/stems."""
    import re

    stmt = select(KnowledgePoint).where(
        KnowledgePoint.target_language == "en",
        KnowledgePoint.type == "vocabulary",
        KnowledgePoint.deleted_at.is_(None),
    )
    result = await db.execute(stmt)
    vocab_kps = result.scalars().all()

    # Group by simplified stem (first 4+ chars after removing common suffixes)
    stem_to_vocab: dict[str, list[KnowledgePoint]] = {}
    suffixes = re.compile(r"(tion|sion|ment|ness|able|ible|ful|less|ous|ive|ing|ed|er|or|ly)$", re.IGNORECASE)

    for kp in vocab_kps:
        word = kp.surface_form.lower()
        stem = suffixes.sub("", word)
        if len(stem) >= 4:
            stem_to_vocab.setdefault(stem, []).append(kp)

    created = 0
    seen_pairs: set[tuple] = set()

    for stem, kp_list in stem_to_vocab.items():
        if len(kp_list) < 2 or len(kp_list) > 10:
            continue

        for i in range(len(kp_list)):
            for j in range(i + 1, len(kp_list)):
                pair = (min(kp_list[i].id, kp_list[j].id), max(kp_list[i].id, kp_list[j].id))
                if pair in seen_pairs:
                    continue
                seen_pairs.add(pair)

                node_a = await _get_node_by_kp_id(db, kp_list[i].id)
                node_b = await _get_node_by_kp_id(db, kp_list[j].id)
                if not node_a or not node_b:
                    continue

                if await _edge_exists(db, node_a.id, node_b.id, "RELATED_TO"):
                    continue

                edge = KnowledgeEdge(
                    source_node_id=node_a.id,
                    target_node_id=node_b.id,
                    edge_type="RELATED_TO",
                    weight=Decimal("0.40"),
                    metadata_={"shared_stem": stem},
                )
                db.add(edge)
                created += 1

    logger.info(f"RELATED_TO edges (en): {created} created")
    return created


async def generate_all_edges(db: AsyncSession) -> dict[str, Any]:
    """Run all edge generation algorithms for both Japanese and English.

    - CONTAINS_KANJI: only for Japanese (kanji extraction)
    - PREREQUISITE_OF: both JLPT and IELTS level progression
    - RELATED_TO: both languages (by shared features)
    """
    containment = await generate_containment_edges(db)
    level = await generate_level_edges(db)
    related = await generate_related_edges(db)

    total = containment["created"] + level["created"] + related["created"]
    return {
        "containment": containment,
        "level_progression": level,
        "related": related,
        "total_edges_created": total,
    }
