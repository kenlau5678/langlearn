"""Embedding generation service for knowledge points using OpenAI API."""

from __future__ import annotations

import logging
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models.knowledge_point import KnowledgePoint

logger = logging.getLogger(__name__)
settings = get_settings()


def _build_embedding_text(kp: KnowledgePoint) -> str:
    """Build the text to embed for a knowledge point.

    Combines surface_form, meaning_zh, and optional explanation for a rich
    semantic representation.
    """
    parts = [kp.surface_form]
    if kp.reading:
        parts.append(kp.reading)
    parts.append(kp.meaning_zh)
    if kp.explanation_zh:
        parts.append(kp.explanation_zh)
    if kp.example_target and len(kp.example_target) > 0:
        parts.append(kp.example_target[0])
    return " | ".join(parts)


async def _generate_single_embedding(text: str) -> list[float] | None:
    """Generate a single embedding vector using OpenAI API."""
    if not settings.openai_api_key or settings.openai_api_key == "sk-placeholder":
        logger.warning("OpenAI API key not configured, skipping embedding generation")
        return None

    try:
        import openai

        client = openai.AsyncOpenAI(api_key=settings.openai_api_key)
        response = await client.embeddings.create(
            input=text,
            model=settings.openai_embedding_model,
        )
        return response.data[0].embedding
    except Exception as e:
        logger.error(f"Embedding generation failed: {e}")
        return None


async def generate_embeddings_batch(
    db: AsyncSession,
    target_language: str | None = None,
    kp_type: str | None = None,
    batch_size: int = 50,
    limit: int | None = None,
) -> dict[str, Any]:
    """Generate embeddings for knowledge points that don't have them yet.

    Args:
        db: Database session
        target_language: Filter by language (e.g., 'ja', 'en')
        kp_type: Filter by type (e.g., 'vocabulary', 'grammar', 'kanji')
        batch_size: Number of KPs to process at once
        limit: Maximum number of KPs to process
    """
    stmt = select(KnowledgePoint).where(
        KnowledgePoint.embedding.is_(None),
        KnowledgePoint.deleted_at.is_(None),
    )

    if target_language:
        stmt = stmt.where(KnowledgePoint.target_language == target_language)
    if kp_type:
        stmt = stmt.where(KnowledgePoint.type == kp_type)

    if limit:
        stmt = stmt.limit(limit)

    result = await db.execute(stmt)
    kps = result.scalars().all()

    if not kps:
        return {"processed": 0, "success": 0, "failed": 0, "message": "No KPs without embeddings found"}

    processed = 0
    success = 0
    failed = 0

    for kp in kps:
        text = _build_embedding_text(kp)
        embedding = await _generate_single_embedding(text)

        if embedding:
            kp.embedding = embedding
            success += 1
        else:
            failed += 1

        processed += 1

        # Commit in batches to avoid long transactions
        if processed % batch_size == 0:
            await db.flush()
            logger.info(f"Embeddings: {processed}/{len(kps)} processed")

    await db.flush()
    logger.info(f"Embedding generation complete: {success} success, {failed} failed out of {processed}")
    return {
        "processed": processed,
        "success": success,
        "failed": failed,
        "total_without_embedding": len(kps),
    }


async def regenerate_embedding(
    db: AsyncSession,
    kp_id,
) -> dict[str, Any]:
    """Regenerate embedding for a single knowledge point."""
    stmt = select(KnowledgePoint).where(KnowledgePoint.id == kp_id)
    result = await db.execute(stmt)
    kp = result.scalar_one_or_none()

    if not kp:
        return {"error": "Knowledge point not found"}

    text = _build_embedding_text(kp)
    embedding = await _generate_single_embedding(text)

    if embedding:
        kp.embedding = embedding
        return {"success": True, "kp_id": str(kp.id)}
    else:
        return {"success": False, "error": "Embedding generation failed"}
