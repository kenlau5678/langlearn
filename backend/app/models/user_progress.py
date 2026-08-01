import uuid
from datetime import date, datetime
from decimal import Decimal
from sqlalchemy import (
    String, Integer, SmallInteger, Text, Boolean, Date, DateTime,
    Numeric, ForeignKey, func
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base


class UserProgress(Base):
    """SM-2 SRS compatible per-user per-knowledge-point progress."""
    __tablename__ = "user_progress"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    knowledge_point_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("knowledge_points.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    # SM-2 fields
    ease_factor: Mapped[Decimal] = mapped_column(
        Numeric(5, 2), default=Decimal("2.50")
    )
    interval_days: Mapped[int] = mapped_column(Integer, default=0)
    repetitions: Mapped[int] = mapped_column(Integer, default=0)
    lapses: Mapped[int] = mapped_column(Integer, default=0)
    next_review_date: Mapped[date] = mapped_column(Date, nullable=False)
    last_review_date: Mapped[date | None] = mapped_column(Date)
    mastery_level: Mapped[str] = mapped_column(
        String(10), default="new", index=True
    )  # new, learning, young, mature, relearning
    total_reviews: Mapped[int] = mapped_column(Integer, default=0)
    correct_count: Mapped[int] = mapped_column(Integer, default=0)
    incorrect_count: Mapped[int] = mapped_column(Integer, default=0)
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    __table_args__ = (
        # Unique constraint: one progress row per user per KP
    )


class ReviewLog(Base):
    """Append-only log of every review event."""
    __tablename__ = "review_logs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"),
        nullable=False, index=True
    )
    knowledge_point_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("knowledge_points.id"),
        nullable=False, index=True
    )
    review_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    quality: Mapped[int] = mapped_column(SmallInteger, nullable=False)  # 0-5
    response_ms: Mapped[int | None] = mapped_column(Integer)
    ease_before: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))
    ease_after: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))
    interval_before: Mapped[int | None] = mapped_column(Integer)
    interval_after: Mapped[int | None] = mapped_column(Integer)
    was_correct: Mapped[bool] = mapped_column(Boolean, nullable=False)
    exercise_type: Mapped[str | None] = mapped_column(String(30))
    metadata_: Mapped[dict] = mapped_column("metadata", JSONB, default=dict)
