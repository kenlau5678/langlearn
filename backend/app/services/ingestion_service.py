"""Bulk data ingestion service for JLPT and IELTS vocabulary, grammar, and kanji reference data."""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.knowledge_point import KnowledgePoint
from app.models.knowledge_graph import KnowledgeNode

logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"


async def _upsert_knowledge_point(
    db: AsyncSession,
    data: dict[str, Any],
    kp_type: str,
    target_language: str = "ja",
    level_system: str = "jlpt",
) -> KnowledgePoint:
    """Insert or update a knowledge point by surface form, level, language, and type."""
    stmt = select(KnowledgePoint).where(
        KnowledgePoint.surface_form == data["surface_form"],
        KnowledgePoint.proficiency_level == data.get("proficiency_level", "N5"),
        KnowledgePoint.target_language == target_language,
        KnowledgePoint.type == kp_type,
        KnowledgePoint.deleted_at.is_(None),
    )
    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()

    if existing:
        field_map = {
            "reading": "reading",
            "pronunciation": "pronunciation",
            "meaning_zh": "meaning_zh",
            "meaning_en": "meaning_en",
            "pos": "pos",
            "explanation_zh": "explanation_zh",
            "example_target": "example_target",
            "example_zh": "example_zh",
            "metadata": "metadata_",
        }
        for source, target in field_map.items():
            if source in data:
                setattr(existing, target, data[source])
        return existing

    kp = KnowledgePoint(
        target_language=target_language,
        type=kp_type,
        proficiency_level=data.get("proficiency_level", "N5"),
        level_system=level_system,
        surface_form=data["surface_form"],
        reading=data.get("reading"),
        pronunciation=data.get("pronunciation"),
        meaning_zh=data["meaning_zh"],
        meaning_en=data.get("meaning_en"),
        pos=data.get("pos"),
        explanation_zh=data.get("explanation_zh"),
        example_target=data.get("example_target"),
        example_zh=data.get("example_zh"),
        metadata_=data.get("metadata", {}),
        source="jlpt_reference",
        is_verified=True,
    )
    db.add(kp)
    await db.flush()
    return kp


async def _ensure_graph_node(db: AsyncSession, kp: KnowledgePoint) -> KnowledgeNode:
    """Ensure a knowledge graph node exists for the given knowledge point."""
    stmt = select(KnowledgeNode).where(KnowledgeNode.knowledge_point_id == kp.id)
    result = await db.execute(stmt)
    node = result.scalar_one_or_none()
    if node:
        return node

    node_type_map = {
        "vocabulary": "Vocabulary",
        "grammar": "GrammarPoint",
        "kanji": "Kanji",
        "sentence_pattern": "SentencePattern",
        "reading": "Reading",
        "idiom": "Idiom",
        "phrasal_verb": "PhrasalVerb",
    }
    node = KnowledgeNode(
        knowledge_point_id=kp.id,
        node_type=node_type_map.get(kp.type, "Vocabulary"),
    )
    db.add(node)
    await db.flush()
    return node


async def ingest_vocabulary(
    db: AsyncSession,
    file_path: str | None = None,
    target_language: str = "ja",
) -> dict[str, Any]:
    """Ingest vocabulary JSON into knowledge_points table.

    Default file paths:
      - ja: data/jlpt_vocab_n5.json, data/jlpt_vocab_n4.json
    """
    files: list[Path] = []
    if file_path:
        files.append(Path(file_path))
    else:
        if target_language == "ja":
            for name in ["jlpt_vocab_n5.json", "jlpt_vocab_n4.json"]:
                p = DATA_DIR / name
                if p.exists():
                    files.append(p)
        elif target_language == "en":
            p = DATA_DIR / "ielts_vocabulary.json"
            if p.exists():
                files.append(p)

    created = 0
    skipped = 0
    errors: list[str] = []

    for fpath in files:
        try:
            raw = json.loads(fpath.read_text(encoding="utf-8"))
            entries = raw if isinstance(raw, list) else raw.get("data", [])
            for entry in entries:
                try:
                    kp = await _upsert_knowledge_point(
                        db, entry, kp_type="vocabulary", target_language=target_language
                    )
                    await _ensure_graph_node(db, kp)
                    created += 1
                except Exception as e:
                    errors.append(f"{fpath.name}: {entry.get('surface_form', '?')} — {e}")
                    skipped += 1
        except Exception as e:
            errors.append(f"{fpath.name}: {e}")

    logger.info(f"Vocabulary ingestion complete: {created} created, {skipped} skipped")
    return {"created": created, "skipped": skipped, "errors": errors[:20], "files": [f.name for f in files]}


async def ingest_grammar(
    db: AsyncSession,
    file_path: str | None = None,
    target_language: str = "ja",
) -> dict[str, Any]:
    """Ingest grammar patterns JSON into knowledge_points table."""
    files: list[Path] = []
    if file_path:
        files.append(Path(file_path))
    else:
        if target_language == "ja":
            p = DATA_DIR / "jlpt_grammar_n5_n4.json"
            if p.exists():
                files.append(p)
        elif target_language == "en":
            p = DATA_DIR / "english_grammar.json"
            if p.exists():
                files.append(p)

    created = 0
    skipped = 0
    errors: list[str] = []

    for fpath in files:
        try:
            raw = json.loads(fpath.read_text(encoding="utf-8"))
            entries = raw if isinstance(raw, list) else raw.get("data", [])
            for entry in entries:
                try:
                    kp_data = {
                        "surface_form": entry["surface_form"],
                        "reading": entry.get("reading"),
                        "meaning_zh": entry["meaning_zh"],
                        "meaning_en": entry.get("meaning_en"),
                        "proficiency_level": entry.get("proficiency_level", "N5"),
                        "explanation_zh": entry.get("explanation_zh"),
                        "example_target": entry.get("example_target"),
                        "example_zh": entry.get("example_zh"),
                        "pos": entry.get("pattern_type", "grammar"),
                    }
                    kp = await _upsert_knowledge_point(
                        db, kp_data, kp_type="grammar", target_language=target_language
                    )
                    await _ensure_graph_node(db, kp)
                    created += 1
                except Exception as e:
                    errors.append(f"{fpath.name}: {entry.get('surface_form', '?')} — {e}")
                    skipped += 1
        except Exception as e:
            errors.append(f"{fpath.name}: {e}")

    logger.info(f"Grammar ingestion complete: {created} created, {skipped} skipped")
    return {"created": created, "skipped": skipped, "errors": errors[:20], "files": [f.name for f in files]}


async def ingest_kanji(
    db: AsyncSession,
    file_path: str | None = None,
    target_language: str = "ja",
) -> dict[str, Any]:
    """Ingest kanji reference data JSON into knowledge_points table."""
    files: list[Path] = []
    if file_path:
        files.append(Path(file_path))
    else:
        if target_language == "ja":
            p = DATA_DIR / "jlpt_kanji_n5_n4.json"
            if p.exists():
                files.append(p)

    created = 0
    skipped = 0
    errors: list[str] = []

    for fpath in files:
        try:
            raw = json.loads(fpath.read_text(encoding="utf-8"))
            entries = raw if isinstance(raw, list) else raw.get("data", [])
            for entry in entries:
                try:
                    readings_on = entry.get("readings_on", [])
                    readings_kun = entry.get("readings_kun", [])
                    all_readings = readings_on + readings_kun
                    reading_str = "、".join(all_readings) if all_readings else None

                    kp_data = {
                        "surface_form": entry["character"],
                        "reading": reading_str,
                        "meaning_zh": entry["meaning_zh"],
                        "meaning_en": entry.get("meaning_en"),
                        "proficiency_level": entry.get("jlpt_level", "N5"),
                        "explanation_zh": f"笔画数: {entry.get('stroke_count', '?')}，学年: {entry.get('grade', '?')}",
                        "pos": "kanji",
                        "metadata": {
                            "stroke_count": entry.get("stroke_count"),
                            "grade": entry.get("grade"),
                            "readings_on": readings_on,
                            "readings_kun": readings_kun,
                        },
                    }
                    kp = await _upsert_knowledge_point(
                        db, kp_data, kp_type="kanji", target_language=target_language
                    )
                    await _ensure_graph_node(db, kp)
                    created += 1
                except Exception as e:
                    errors.append(f"{fpath.name}: {entry.get('character', '?')} — {e}")
                    skipped += 1
        except Exception as e:
            errors.append(f"{fpath.name}: {e}")

    logger.info(f"Kanji ingestion complete: {created} created, {skipped} skipped")
    return {"created": created, "skipped": skipped, "errors": errors[:20], "files": [f.name for f in files]}


async def ingest_all(
    db: AsyncSession,
    target_language: str = "ja",
) -> dict[str, Any]:
    """Run full ingestion for all data types.

    For Japanese: vocabulary + grammar + kanji
    For English: vocabulary + grammar (no kanji)
    """
    vocab_result = await ingest_vocabulary(db, target_language=target_language)
    grammar_result = await ingest_grammar(db, target_language=target_language)

    kanji_result = {"created": 0, "skipped": 0, "errors": [], "files": []}
    if target_language == "ja":
        kanji_result = await ingest_kanji(db, target_language=target_language)

    return {
        "vocabulary": vocab_result,
        "grammar": grammar_result,
        "kanji": kanji_result,
        "total_created": (
            vocab_result["created"] + grammar_result["created"] + kanji_result["created"]
        ),
    }
