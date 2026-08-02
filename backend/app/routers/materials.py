from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.user import User
from app.models.knowledge_point import Material, MaterialChunk
from app.schemas.knowledge_point import (
    MaterialCreate, MaterialUpdate, MaterialResponse, MaterialDetailResponse,
)
from app.services.auth_service import get_current_user
from app.middleware import NotFoundError
from app.utils import paginated_query

router = APIRouter()


@router.post("", response_model=MaterialResponse, status_code=201)
async def create_material(
    data: MaterialCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    material = Material(
        title=data.title,
        content_text=data.content_text,
        target_language=data.target_language,
        source_type=data.source_type,
        source_url=data.source_url,
        proficiency_level=data.proficiency_level,
        level_system=data.level_system,
        metadata_=data.metadata or {},
        created_by=current_user.id,
        status="ready",
    )
    db.add(material)
    await db.flush()
    await db.refresh(material)
    return material


@router.get("")
async def list_materials(
    target_language: str | None = Query(None),
    proficiency_level: str | None = Query(None),
    source_type: str | None = Query(None),
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Material).where(
        Material.deleted_at.is_(None),
        Material.created_by == current_user.id,
    )
    count_stmt = select(func.count()).select_from(Material).where(
        Material.deleted_at.is_(None),
        Material.created_by == current_user.id,
    )

    if target_language:
        stmt = stmt.where(Material.target_language == target_language)
        count_stmt = count_stmt.where(Material.target_language == target_language)
    if proficiency_level:
        stmt = stmt.where(Material.proficiency_level == proficiency_level)
        count_stmt = count_stmt.where(Material.proficiency_level == proficiency_level)
    if source_type:
        stmt = stmt.where(Material.source_type == source_type)
        count_stmt = count_stmt.where(Material.source_type == source_type)
    if search:
        stmt = stmt.where(Material.title.ilike(f"%{search}%"))
        count_stmt = count_stmt.where(Material.title.ilike(f"%{search}%"))

    stmt = stmt.order_by(Material.created_at.desc())

    result = await paginated_query(db, stmt, count_stmt, page, page_size)
    result.data = [MaterialResponse.model_validate(m) for m in result.data]
    return result


@router.get("/{material_id}", response_model=MaterialDetailResponse)
async def get_material(
    material_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Material)
        .where(
            Material.id == material_id,
            Material.deleted_at.is_(None),
            Material.created_by == current_user.id,
        )
        .options(selectinload(Material.chunks))
    )
    material = result.scalar_one_or_none()
    if not material:
        raise NotFoundError("material", str(material_id))
    return material


@router.patch("/{material_id}", response_model=MaterialResponse)
async def update_material(
    material_id: UUID,
    data: MaterialUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Material).where(
            Material.id == material_id,
            Material.deleted_at.is_(None),
            Material.created_by == current_user.id,
        )
    )
    material = result.scalar_one_or_none()
    if not material:
        raise NotFoundError("material", str(material_id))

    if data.title is not None:
        material.title = data.title
    if data.metadata is not None:
        material.metadata_ = data.metadata
    if data.status is not None:
        material.status = data.status
    await db.flush()
    await db.refresh(material)
    return material


@router.delete("/{material_id}", status_code=204)
async def delete_material(
    material_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from datetime import datetime, timezone
    result = await db.execute(
        select(Material).where(
            Material.id == material_id,
            Material.deleted_at.is_(None),
            Material.created_by == current_user.id,
        )
    )
    material = result.scalar_one_or_none()
    if not material:
        raise NotFoundError("material", str(material_id))
    material.deleted_at = datetime.now(timezone.utc)
