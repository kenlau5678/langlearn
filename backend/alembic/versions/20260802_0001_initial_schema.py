"""Initial schema.

Revision ID: 20260802_0001
Revises:
Create Date: 2026-08-02
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector
from sqlalchemy.dialects import postgresql


revision: str = "20260802_0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("display_name", sa.String(length=100), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("native_language", sa.String(length=10), nullable=False),
        sa.Column("daily_goal", sa.Integer(), nullable=False),
        sa.Column("preferences", sa.JSON(), nullable=False),
        sa.Column("streak_days", sa.Integer(), nullable=False),
        sa.Column("last_active_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "knowledge_points",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("target_language", sa.String(length=10), nullable=False),
        sa.Column("type", sa.String(length=20), nullable=False),
        sa.Column("proficiency_level", sa.String(length=10), nullable=False),
        sa.Column("level_system", sa.String(length=10), nullable=False),
        sa.Column("surface_form", sa.Text(), nullable=False),
        sa.Column("reading", sa.Text(), nullable=True),
        sa.Column("pronunciation", sa.Text(), nullable=True),
        sa.Column("meaning_zh", sa.Text(), nullable=False),
        sa.Column("meaning_en", sa.Text(), nullable=True),
        sa.Column("pos", sa.String(length=30), nullable=True),
        sa.Column("explanation_zh", sa.Text(), nullable=True),
        sa.Column("example_target", postgresql.ARRAY(sa.Text()), nullable=True),
        sa.Column("example_zh", postgresql.ARRAY(sa.Text()), nullable=True),
        sa.Column("metadata", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("embedding", Vector(dim=1536), nullable=True),
        sa.Column("source", sa.String(length=50), nullable=True),
        sa.Column("is_verified", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_knowledge_points_target_language", "knowledge_points", ["target_language"])
    op.create_index("ix_knowledge_points_type", "knowledge_points", ["type"])
    op.create_index("ix_knowledge_points_proficiency_level", "knowledge_points", ["proficiency_level"])

    op.create_table(
        "materials",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("title", sa.String(length=500), nullable=False),
        sa.Column("content_text", sa.Text(), nullable=False),
        sa.Column("content_json", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("target_language", sa.String(length=10), nullable=False),
        sa.Column("source_type", sa.String(length=20), nullable=False),
        sa.Column("source_url", sa.Text(), nullable=True),
        sa.Column("source_file", sa.Text(), nullable=True),
        sa.Column("proficiency_level", sa.String(length=10), nullable=False),
        sa.Column("level_system", sa.String(length=10), nullable=False),
        sa.Column("difficulty", sa.Numeric(3, 2), nullable=False),
        sa.Column("embedding", Vector(dim=1536), nullable=True),
        sa.Column("metadata", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("created_by", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_materials_target_language", "materials", ["target_language"])
    op.create_index("ix_materials_status", "materials", ["status"])

    op.create_table(
        "user_language_profiles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("target_language", sa.String(length=10), nullable=False),
        sa.Column("current_level", sa.String(length=10), nullable=False),
        sa.Column("target_level", sa.String(length=10), nullable=False),
        sa.Column("level_system", sa.String(length=10), nullable=False),
        sa.Column("daily_goal", sa.Integer(), nullable=False),
        sa.Column("streak_days", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_user_language_profiles_user_id", "user_language_profiles", ["user_id"])

    op.create_table(
        "material_chunks",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("material_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("chunk_index", sa.Integer(), nullable=False),
        sa.Column("text_target", sa.Text(), nullable=False),
        sa.Column("text_zh", sa.Text(), nullable=True),
        sa.Column("reading", sa.Text(), nullable=True),
        sa.Column("chunk_type", sa.String(length=20), nullable=False),
        sa.Column("embedding", Vector(dim=1536), nullable=True),
        sa.Column("token_count", sa.Integer(), nullable=True),
        sa.Column("metadata", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["material_id"], ["materials.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_material_chunks_material_id", "material_chunks", ["material_id"])

    op.create_table(
        "knowledge_nodes",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("knowledge_point_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("node_type", sa.String(length=30), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["knowledge_point_id"], ["knowledge_points.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("knowledge_point_id"),
    )
    op.create_index("ix_knowledge_nodes_node_type", "knowledge_nodes", ["node_type"])

    op.create_table(
        "exercises",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("knowledge_point_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("material_chunk_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("target_language", sa.String(length=10), nullable=False),
        sa.Column("exercise_type", sa.String(length=30), nullable=False),
        sa.Column("question_data", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("answer_data", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("explanation", sa.Text(), nullable=True),
        sa.Column("difficulty", sa.Numeric(3, 2), nullable=False),
        sa.Column("proficiency_level", sa.String(length=10), nullable=False),
        sa.Column("level_system", sa.String(length=10), nullable=False),
        sa.Column("is_ai_generated", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["knowledge_point_id"], ["knowledge_points.id"]),
        sa.ForeignKeyConstraint(["material_chunk_id"], ["material_chunks.id"]),
    )
    op.create_index("ix_exercises_knowledge_point_id", "exercises", ["knowledge_point_id"])
    op.create_index("ix_exercises_target_language", "exercises", ["target_language"])
    op.create_index("ix_exercises_exercise_type", "exercises", ["exercise_type"])

    op.create_table(
        "material_knowledge_points",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("material_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("chunk_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("knowledge_point_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("char_offset_start", sa.Integer(), nullable=True),
        sa.Column("char_offset_end", sa.Integer(), nullable=True),
        sa.Column("chunk_offset_start", sa.Integer(), nullable=True),
        sa.Column("chunk_offset_end", sa.Integer(), nullable=True),
        sa.Column("confidence", sa.Numeric(3, 2), nullable=False),
        sa.Column("tagging_method", sa.String(length=20), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["material_id"], ["materials.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["chunk_id"], ["material_chunks.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["knowledge_point_id"], ["knowledge_points.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_material_knowledge_points_material_id", "material_knowledge_points", ["material_id"])
    op.create_index("ix_material_knowledge_points_chunk_id", "material_knowledge_points", ["chunk_id"])
    op.create_index("ix_material_knowledge_points_knowledge_point_id", "material_knowledge_points", ["knowledge_point_id"])

    op.create_table(
        "knowledge_edges",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("source_node_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("target_node_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("edge_type", sa.String(length=30), nullable=False),
        sa.Column("weight", sa.Numeric(3, 2), nullable=False),
        sa.Column("metadata", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["source_node_id"], ["knowledge_nodes.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["target_node_id"], ["knowledge_nodes.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_knowledge_edges_source_node_id", "knowledge_edges", ["source_node_id"])
    op.create_index("ix_knowledge_edges_target_node_id", "knowledge_edges", ["target_node_id"])
    op.create_index("ix_knowledge_edges_edge_type", "knowledge_edges", ["edge_type"])

    op.create_table(
        "user_progress",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("knowledge_point_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("ease_factor", sa.Numeric(5, 2), nullable=False),
        sa.Column("interval_days", sa.Integer(), nullable=False),
        sa.Column("repetitions", sa.Integer(), nullable=False),
        sa.Column("lapses", sa.Integer(), nullable=False),
        sa.Column("next_review_date", sa.Date(), nullable=False),
        sa.Column("last_review_date", sa.Date(), nullable=True),
        sa.Column("mastery_level", sa.String(length=10), nullable=False),
        sa.Column("total_reviews", sa.Integer(), nullable=False),
        sa.Column("correct_count", sa.Integer(), nullable=False),
        sa.Column("incorrect_count", sa.Integer(), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["knowledge_point_id"], ["knowledge_points.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_user_progress_user_id", "user_progress", ["user_id"])
    op.create_index("ix_user_progress_knowledge_point_id", "user_progress", ["knowledge_point_id"])
    op.create_index("ix_user_progress_mastery_level", "user_progress", ["mastery_level"])

    op.create_table(
        "review_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("knowledge_point_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("review_date", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("quality", sa.SmallInteger(), nullable=False),
        sa.Column("response_ms", sa.Integer(), nullable=True),
        sa.Column("ease_before", sa.Numeric(5, 2), nullable=True),
        sa.Column("ease_after", sa.Numeric(5, 2), nullable=True),
        sa.Column("interval_before", sa.Integer(), nullable=True),
        sa.Column("interval_after", sa.Integer(), nullable=True),
        sa.Column("was_correct", sa.Boolean(), nullable=False),
        sa.Column("exercise_type", sa.String(length=30), nullable=True),
        sa.Column("metadata", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["knowledge_point_id"], ["knowledge_points.id"]),
    )
    op.create_index("ix_review_logs_user_id", "review_logs", ["user_id"])
    op.create_index("ix_review_logs_knowledge_point_id", "review_logs", ["knowledge_point_id"])


def downgrade() -> None:
    op.drop_table("review_logs")
    op.drop_table("user_progress")
    op.drop_table("knowledge_edges")
    op.drop_table("material_knowledge_points")
    op.drop_table("exercises")
    op.drop_table("knowledge_nodes")
    op.drop_table("material_chunks")
    op.drop_table("user_language_profiles")
    op.drop_table("materials")
    op.drop_table("knowledge_points")
    op.drop_table("users")
