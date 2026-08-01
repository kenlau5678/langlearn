from uuid import UUID
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.services.auth_service import get_current_user
from app.services import progress_service

router = APIRouter()


class ReviewSubmitRequest(BaseModel):
    knowledge_point_id: str
    quality: int  # 0-5
    response_ms: int | None = None
    exercise_type: str | None = None


class AddCardRequest(BaseModel):
    knowledge_point_id: str


@router.get("/reviews/due")
async def get_due_reviews(
    target_language: str | None = Query(None, description="Filter by language: en, ja"),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get knowledge points due for review, sorted by priority."""
    items = await progress_service.get_due_reviews(
        db,
        user_id=current_user.id,
        target_language=target_language,
        limit=limit,
    )
    return {
        "data": items,
        "meta": {"due_count": len(items)},
    }


@router.post("/reviews")
async def submit_review(
    request: ReviewSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Submit a review and update SM-2 SRS state."""
    result = await progress_service.submit_review(
        db,
        user_id=current_user.id,
        knowledge_point_id=UUID(request.knowledge_point_id),
        quality=request.quality,
        response_ms=request.response_ms,
        exercise_type=request.exercise_type,
    )
    return {"data": result, "message": "复习记录已保存"}


@router.post("/cards/add")
async def add_card(
    request: AddCardRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Add a knowledge point to the user's review deck."""
    progress = await progress_service.add_card_to_deck(
        db,
        user_id=current_user.id,
        knowledge_point_id=UUID(request.knowledge_point_id),
    )
    return {
        "message": "已添加到复习卡组",
        "data": {
            "id": str(progress.id),
            "mastery_level": progress.mastery_level,
            "next_review_date": progress.next_review_date.isoformat(),
        },
    }


@router.get("/stats")
async def get_stats(
    target_language: str | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get aggregated review statistics."""
    stats = await progress_service.get_stats(
        db,
        user_id=current_user.id,
        target_language=target_language,
    )
    stats["streak"] = current_user.streak_days
    return stats
