import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, DateTime, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base


class KnowledgeNode(Base):
    """Graph node, 1:1 with knowledge_points."""
    __tablename__ = "knowledge_nodes"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    knowledge_point_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("knowledge_points.id", ondelete="CASCADE"),
        nullable=False, unique=True
    )
    node_type: Mapped[str] = mapped_column(
        String(30), nullable=False, index=True
    )  # GrammarPoint, Vocabulary, Kanji, Reading, SentencePattern, Topic, Idiom, PhrasalVerb
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    knowledge_point: Mapped["KnowledgePoint"] = relationship(back_populates="graph_node")  # noqa: F821


class KnowledgeEdge(Base):
    """Graph edge between knowledge nodes."""
    __tablename__ = "knowledge_edges"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    source_node_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("knowledge_nodes.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    target_node_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("knowledge_nodes.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    edge_type: Mapped[str] = mapped_column(
        String(30), nullable=False, index=True
    )  # PREREQUISITE_OF, RELATED_TO, USES_GRAMMAR, CONTAINS_KANJI, HAS_READING,
      # APPEARS_IN_LEVEL, SYNONYM_OF, ANTONYM_OF, DERIVED_FROM, CROSS_LANGUAGE_EQUIVALENT
    weight: Mapped[Decimal] = mapped_column(Numeric(3, 2), default=Decimal("1.00"))
    metadata_: Mapped[dict] = mapped_column("metadata", JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
