"""Progress and review database service."""

from __future__ import annotations

import logging
from datetime import date, datetime, timezone
from decimal import Decimal
from uuid import UUID

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.user_progress import UserProgress, ReviewLog
from app.models.knowledge_point import KnowledgePoint
from app.services.srs_service import sm2_process, get_card_priority, SM2Result

logger = logging.getLogger(__name__)


async def get_or_create_progress(
    db: AsyncSession,
    user_id: UUID,
    knowledge_point_id: UUID,
) -> UserProgress:
    """Get or create a UserProgress row for a user+KP pair."""
    stmt = select(UserProgress).where(
        UserProgress.user_id == user_id,
        UserProgress.knowledge_point_id == knowledge_point_id,
        UserProgress.deleted_at.is_(None),
    )
    result = await db.execute(stmt)
    progress = result.scalar_one_or_none()

    if progress:
        return progress

    progress = UserProgress(
        user_id=user_id,
        knowledge_point_id=knowledge_point_id,
        ease_factor=Decimal("2.50"),
        interval_days=0,
        repetitions=0,
        lapses=0,
        next_review_date=date.today(),
        mastery_level="new",
    )
    db.add(progress)
    await db.flush()
    return progress


async def get_due_reviews(
    db: AsyncSession,
    user_id: UUID,
    target_language: str | None = None,
    limit: int = 20,
    today: date | None = None,
) -> list[dict]:
    """Get knowledge points due for review, sorted by priority."""
    if today is None:
        today = date.today()

    # Get all progress rows due today or earlier
    stmt = select(UserProgress).where(
        UserProgress.user_id == user_id,
        UserProgress.next_review_date <= today,
        UserProgress.deleted_at.is_(None),
    )

    result = await db.execute(stmt)
    due_progress = result.scalars().all()

    if not due_progress:
        return []

    # Load associated knowledge points
    kp_ids = [p.knowledge_point_id for p in due_progress]
    kp_stmt = select(KnowledgePoint).where(
        KnowledgePoint.id.in_(kp_ids),
        KnowledgePoint.deleted_at.is_(None),
    )
    if target_language:
        kp_stmt = kp_stmt.where(KnowledgePoint.target_language == target_language)

    kp_result = await db.execute(kp_stmt)
    kp_map: dict[UUID, KnowledgePoint] = {
        kp.id: kp for kp in kp_result.scalars().all()
    }

    # Build review items with priority
    items = []
    for progress in due_progress:
        kp = kp_map.get(progress.knowledge_point_id)
        if not kp:
            continue

        priority = get_card_priority(
            next_review_date=progress.next_review_date,
            ease_factor=float(progress.ease_factor),
            repetitions=progress.repetitions,
            lapses=progress.lapses,
            today=today,
        )

        items.append({
            "progress_id": str(progress.id),
            "knowledge_point_id": str(kp.id),
            "surface_form": kp.surface_form,
            "reading": kp.reading,
            "pronunciation": kp.pronunciation,
            "meaning_zh": kp.meaning_zh,
            "meaning_en": kp.meaning_en,
            "pos": kp.pos,
            "type": kp.type,
            "target_language": kp.target_language,
            "proficiency_level": kp.proficiency_level,
            "example_target": kp.example_target,
            "example_zh": kp.example_zh,
            "explanation_zh": kp.explanation_zh,
            "ease_factor": float(progress.ease_factor),
            "interval_days": progress.interval_days,
            "repetitions": progress.repetitions,
            "lapses": progress.lapses,
            "mastery_level": progress.mastery_level,
            "next_review_date": progress.next_review_date.isoformat(),
            "priority": priority,
        })

    # Sort by priority (highest first)
    items.sort(key=lambda x: x["priority"], reverse=True)
    return items[:limit]


async def submit_review(
    db: AsyncSession,
    user_id: UUID,
    knowledge_point_id: UUID,
    quality: int,
    response_ms: int | None = None,
    exercise_type: str | None = None,
) -> dict:
    """Process a review submission and update SRS state."""
    if not 0 <= quality <= 5:
        raise ValueError("Quality must be 0-5")

    progress = await get_or_create_progress(db, user_id, knowledge_point_id)

    # Run SM-2
    result = sm2_process(
        quality=quality,
        ease_factor=float(progress.ease_factor),
        interval_days=progress.interval_days,
        repetitions=progress.repetitions,
        lapses=progress.lapses,
    )

    # Update progress
    progress.ease_factor = Decimal(str(round(result.ease_after, 2)))
    progress.interval_days = result.interval_after
    progress.repetitions = result.repetitions
    progress.lapses = result.lapses
    progress.next_review_date = result.next_review
    progress.last_review_date = date.today()
    progress.mastery_level = result.mastery_level
    progress.total_reviews += 1
    if result.was_correct:
        progress.correct_count += 1
    else:
        progress.incorrect_count += 1

    # Log the review
    log = ReviewLog(
        user_id=user_id,
        knowledge_point_id=knowledge_point_id,
        quality=quality,
        response_ms=response_ms,
        ease_before=Decimal(str(round(result.ease_before, 2))),
        ease_after=Decimal(str(round(result.ease_after, 2))),
        interval_before=result.interval_before,
        interval_after=result.interval_after,
        was_correct=result.was_correct,
        exercise_type=exercise_type,
    )
    db.add(log)
    await db.flush()

    return {
        "was_correct": result.was_correct,
        "next_review": result.next_review.isoformat(),
        "interval_days": result.interval_after,
        "ease_factor": round(result.ease_after, 2),
        "mastery_level": result.mastery_level,
    }


async def add_card_to_deck(
    db: AsyncSession,
    user_id: UUID,
    knowledge_point_id: UUID,
) -> UserProgress:
    """Add a knowledge point to the user's review deck (as 'new')."""
    return await get_or_create_progress(db, user_id, knowledge_point_id)


async def get_stats(
    db: AsyncSession,
    user_id: UUID,
    target_language: str | None = None,
) -> dict:
    """Get aggregated review statistics for a user."""
    base_filter = [
        UserProgress.user_id == user_id,
        UserProgress.deleted_at.is_(None),
    ]

    if target_language:
        # Join with knowledge_points to filter by language
        stmt = (
            select(UserProgress.mastery_level, func.count())
            .join(KnowledgePoint, KnowledgePoint.id == UserProgress.knowledge_point_id)
            .where(
                *base_filter,
                KnowledgePoint.target_language == target_language,
                KnowledgePoint.deleted_at.is_(None),
            )
            .group_by(UserProgress.mastery_level)
        )
    else:
        stmt = (
            select(UserProgress.mastery_level, func.count())
            .where(*base_filter)
            .group_by(UserProgress.mastery_level)
        )

    result = await db.execute(stmt)
    counts = {row[0]: row[1] for row in result.all()}

    # Due count
    due_stmt = (
        select(func.count())
        .select_from(UserProgress)
        .where(
            *base_filter,
            UserProgress.next_review_date <= date.today(),
        )
    )
    if target_language:
        due_stmt = due_stmt.join(
            KnowledgePoint, KnowledgePoint.id == UserProgress.knowledge_point_id
        ).where(KnowledgePoint.target_language == target_language)

    due_result = await db.execute(due_stmt)
    due_count = due_result.scalar() or 0

    # Reviews today
    today_start = datetime.combine(date.today(), datetime.min.time()).replace(
        tzinfo=timezone.utc
    )
    reviewed_stmt = (
        select(func.count())
        .select_from(ReviewLog)
        .where(
            ReviewLog.user_id == user_id,
            ReviewLog.review_date >= today_start,
        )
    )
    reviewed_result = await db.execute(reviewed_stmt)
    reviewed_today = reviewed_result.scalar() or 0

    total = sum(counts.values())

    return {
        "total_cards": total,
        "new": counts.get("new", 0),
        "learning": counts.get("learning", 0),
        "young": counts.get("young", 0),
        "mature": counts.get("mature", 0),
        "relearning": counts.get("relearning", 0),
        "due_today": due_count,
        "reviewed_today": reviewed_today,
    }
