from datetime import date, datetime
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel


class ReviewSubmit(BaseModel):
    knowledge_point_id: UUID
    quality: int  # 0-5 SM-2 quality
    response_ms: int | None = None
    exercise_type: str | None = None


class ReviewResponse(BaseModel):
    knowledge_point_id: UUID
    ease_factor: Decimal
    interval_days: int
    next_review_date: date
    was_correct: bool
    mastery_level: str


class ProgressStats(BaseModel):
    total_cards: int
    new_cards: int
    learning: int
    young: int
    mature: int
    relearning: int
    due_today: int
    reviewed_today: int
    streak: int


class UserProgressResponse(BaseModel):
    id: UUID
    knowledge_point_id: UUID
    ease_factor: Decimal
    interval_days: int
    repetitions: int
    lapses: int
    next_review_date: date
    mastery_level: str
    total_reviews: int
    correct_count: int
    incorrect_count: int

    model_config = {"from_attributes": True}
