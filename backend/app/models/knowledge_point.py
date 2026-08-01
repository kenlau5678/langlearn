import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, Integer, Text, Boolean, DateTime, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from pgvector.sqlalchemy import Vector
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base


class KnowledgePoint(Base):
    """Unified table for vocabulary, grammar, kanji, etc. across both languages."""
    __tablename__ = "knowledge_points"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    target_language: Mapped[str] = mapped_column(
        String(10), nullable=False, index=True
    )  # 'en' or 'ja'
    type: Mapped[str] = mapped_column(
        String(20), nullable=False, index=True
    )  # vocabulary, grammar, kanji, sentence_pattern, reading, topic, idiom, phrasal_verb
    proficiency_level: Mapped[str] = mapped_column(
        String(10), nullable=False, index=True
    )  # N5, 4.0, A1, etc.
    level_system: Mapped[str] = mapped_column(
        String(10), nullable=False
    )  # jlpt, ielts, cefr
    surface_form: Mapped[str] = mapped_column(Text, nullable=False)
    reading: Mapped[str | None] = mapped_column(Text)
    pronunciation: Mapped[str | None] = mapped_column(Text)
    meaning_zh: Mapped[str] = mapped_column(Text, nullable=False)
    meaning_en: Mapped[str | None] = mapped_column(Text)
    pos: Mapped[str | None] = mapped_column(String(30))
    explanation_zh: Mapped[str | None] = mapped_column(Text)
    example_target: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    example_zh: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    metadata_: Mapped[dict] = mapped_column("metadata", JSONB, default=dict)
    embedding: Mapped[list[float] | None] = mapped_column(Vector(1536))
    source: Mapped[str | None] = mapped_column(String(50))
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # Relationships
    graph_node: Mapped["KnowledgeNode | None"] = relationship(back_populates="knowledge_point")


class Material(Base):
    __tablename__ = "materials"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    content_text: Mapped[str] = mapped_column(Text, nullable=False)
    content_json: Mapped[dict | None] = mapped_column(JSONB)
    target_language: Mapped[str] = mapped_column(
        String(10), nullable=False, index=True
    )
    source_type: Mapped[str] = mapped_column(String(20), nullable=False)
    source_url: Mapped[str | None] = mapped_column(Text)
    source_file: Mapped[str | None] = mapped_column(Text)
    proficiency_level: Mapped[str] = mapped_column(String(10), nullable=False)
    level_system: Mapped[str] = mapped_column(String(10), nullable=False)
    difficulty: Mapped[Decimal] = mapped_column(Numeric(3, 2), default=Decimal("0.50"))
    embedding: Mapped[list[float] | None] = mapped_column(Vector(1536))
    metadata_: Mapped[dict] = mapped_column("metadata", JSONB, default=dict)
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="draft", index=True
    )
    created_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # Relationships
    chunks: Mapped[list["MaterialChunk"]] = relationship(
        back_populates="material", cascade="all, delete-orphan"
    )


class MaterialChunk(Base):
    __tablename__ = "material_chunks"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    material_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("materials.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False)
    text_target: Mapped[str] = mapped_column(Text, nullable=False)
    text_zh: Mapped[str | None] = mapped_column(Text)
    reading: Mapped[str | None] = mapped_column(Text)
    chunk_type: Mapped[str] = mapped_column(String(20), default="sentence")
    embedding: Mapped[list[float] | None] = mapped_column(Vector(1536))
    token_count: Mapped[int | None] = mapped_column(Integer)
    metadata_: Mapped[dict] = mapped_column("metadata", JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # Relationships
    material: Mapped["Material"] = relationship(back_populates="chunks")


class MaterialKnowledgePoint(Base):
    """Junction: many-to-many between materials/chunks and knowledge points."""
    __tablename__ = "material_knowledge_points"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    material_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("materials.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    chunk_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("material_chunks.id", ondelete="SET NULL"),
        index=True
    )
    knowledge_point_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("knowledge_points.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    char_offset_start: Mapped[int | None] = mapped_column(Integer)
    char_offset_end: Mapped[int | None] = mapped_column(Integer)
    chunk_offset_start: Mapped[int | None] = mapped_column(Integer)
    chunk_offset_end: Mapped[int | None] = mapped_column(Integer)
    confidence: Mapped[Decimal] = mapped_column(
        Numeric(3, 2), default=Decimal("1.00")
    )
    tagging_method: Mapped[str] = mapped_column(String(20), default="manual")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
