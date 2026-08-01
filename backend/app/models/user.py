import uuid
from datetime import datetime
from sqlalchemy import String, Integer, JSON, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    native_language: Mapped[str] = mapped_column(String(10), default="zh")
    daily_goal: Mapped[int] = mapped_column(Integer, default=20)
    preferences: Mapped[dict] = mapped_column(JSON, default=dict)
    streak_days: Mapped[int] = mapped_column(Integer, default=0)
    last_active_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # Relationships
    language_profiles: Mapped[list["UserLanguageProfile"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class UserLanguageProfile(Base):
    """One row per user per target language (en/ja)."""
    __tablename__ = "user_language_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    target_language: Mapped[str] = mapped_column(String(10), nullable=False)  # 'en' or 'ja'
    current_level: Mapped[str] = mapped_column(String(10), nullable=False)  # N5, 4.0, etc.
    target_level: Mapped[str] = mapped_column(String(10), nullable=False)
    level_system: Mapped[str] = mapped_column(String(10), nullable=False)  # jlpt, ielts, cefr
    daily_goal: Mapped[int] = mapped_column(Integer, default=20)
    streak_days: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    user: Mapped["User"] = relationship(back_populates="language_profiles")

    __table_args__ = (
        {"schema": None},
    )
