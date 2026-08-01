from datetime import datetime
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel


# --- Knowledge Point ---
class KnowledgePointCreate(BaseModel):
    target_language: str
    type: str
    proficiency_level: str
    level_system: str
    surface_form: str
    reading: str | None = None
    pronunciation: str | None = None
    meaning_zh: str
    meaning_en: str | None = None
    pos: str | None = None
    explanation_zh: str | None = None
    example_target: list[str] | None = None
    example_zh: list[str] | None = None
    metadata: dict | None = None
    source: str | None = None


class KnowledgePointUpdate(BaseModel):
    meaning_zh: str | None = None
    meaning_en: str | None = None
    explanation_zh: str | None = None
    example_target: list[str] | None = None
    example_zh: list[str] | None = None
    metadata: dict | None = None
    is_verified: bool | None = None


class KnowledgePointResponse(BaseModel):
    id: UUID
    target_language: str
    type: str
    proficiency_level: str
    level_system: str
    surface_form: str
    reading: str | None
    pronunciation: str | None
    meaning_zh: str
    meaning_en: str | None
    pos: str | None
    explanation_zh: str | None
    example_target: list[str] | None
    example_zh: list[str] | None
    metadata: dict
    source: str | None
    is_verified: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Material ---
class MaterialCreate(BaseModel):
    title: str
    content_text: str
    target_language: str
    source_type: str = "text"
    source_url: str | None = None
    proficiency_level: str
    level_system: str
    metadata: dict | None = None


class MaterialUpdate(BaseModel):
    title: str | None = None
    metadata: dict | None = None
    status: str | None = None


class MaterialResponse(BaseModel):
    id: UUID
    title: str
    content_text: str
    target_language: str
    source_type: str
    proficiency_level: str
    level_system: str
    difficulty: Decimal
    status: str
    metadata: dict
    created_at: datetime

    model_config = {"from_attributes": True}


class MaterialDetailResponse(MaterialResponse):
    chunks: list["MaterialChunkResponse"] = []


# --- Material Chunk ---
class MaterialChunkResponse(BaseModel):
    id: UUID
    chunk_index: int
    text_target: str
    text_zh: str | None
    reading: str | None
    chunk_type: str
    token_count: int | None

    model_config = {"from_attributes": True}
