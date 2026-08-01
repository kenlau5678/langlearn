import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base


class Exercise(Base):
    __tablename__ = "exercises"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    knowledge_point_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("knowledge_points.id"),
        nullable=False, index=True
    )
    material_chunk_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("material_chunks.id")
    )
    target_language: Mapped[str] = mapped_column(
        String(10), nullable=False, index=True
    )
    exercise_type: Mapped[str] = mapped_column(
        String(30), nullable=False, index=True
    )  # fill_blank, translation_target_zh, translation_zh_target, etc.
    question_data: Mapped[dict] = mapped_column(JSONB, nullable=False)
    answer_data: Mapped[dict] = mapped_column(JSONB, nullable=False)
    explanation: Mapped[str | None] = mapped_column(Text)
    difficulty: Mapped[Decimal] = mapped_column(Numeric(3, 2), default=Decimal("0.50"))
    proficiency_level: Mapped[str] = mapped_column(String(10), nullable=False)
    level_system: Mapped[str] = mapped_column(String(10), nullable=False)
    is_ai_generated: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
