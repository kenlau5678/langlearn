from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.models.knowledge_point import KnowledgePoint
from app.schemas.knowledge_point import (
    KnowledgePointCreate, KnowledgePointUpdate, KnowledgePointResponse,
)
from app.services.auth_service import get_current_user
from app.middleware import NotFoundError
from app.utils import paginated_query

router = APIRouter()


@router.post("", response_model=KnowledgePointResponse, status_code=201)
async def create_kp(
    data: KnowledgePointCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    kp = KnowledgePoint(
        target_language=data.target_language,
        type=data.type,
        proficiency_level=data.proficiency_level,
        level_system=data.level_system,
        surface_form=data.surface_form,
        reading=data.reading,
        pronunciation=data.pronunciation,
        meaning_zh=data.meaning_zh,
        meaning_en=data.meaning_en,
        pos=data.pos,
        explanation_zh=data.explanation_zh,
        example_target=data.example_target,
        example_zh=data.example_zh,
        metadata_=data.metadata or {},
        source=data.source,
    )
    db.add(kp)
    await db.flush()
    await db.refresh(kp)
    return kp


@router.get("")
async def list_kps(
    target_language: str | None = Query(None),
    type: str | None = Query(None),
    proficiency_level: str | None = Query(None),
    level_system: str | None = Query(None),
    pos: str | None = Query(None),
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(KnowledgePoint).where(KnowledgePoint.deleted_at.is_(None))
    count_stmt = select(func.count()).select_from(KnowledgePoint).where(
        KnowledgePoint.deleted_at.is_(None)
    )

    filters = []
    if target_language:
        filters.append(KnowledgePoint.target_language == target_language)
    if type:
        filters.append(KnowledgePoint.type == type)
    if proficiency_level:
        filters.append(KnowledgePoint.proficiency_level == proficiency_level)
    if level_system:
        filters.append(KnowledgePoint.level_system == level_system)
    if pos:
        filters.append(KnowledgePoint.pos == pos)
    if search:
        filters.append(KnowledgePoint.surface_form.ilike(f"%{search}%"))

    for f in filters:
        stmt = stmt.where(f)
        count_stmt = count_stmt.where(f)

    stmt = stmt.order_by(KnowledgePoint.created_at.desc())

    result = await paginated_query(db, stmt, count_stmt, page, page_size)
    result.data = [KnowledgePointResponse.model_validate(kp) for kp in result.data]
    return result


@router.get("/{kp_id}", response_model=KnowledgePointResponse)
async def get_kp(
    kp_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(KnowledgePoint).where(
            KnowledgePoint.id == kp_id,
            KnowledgePoint.deleted_at.is_(None),
        )
    )
    kp = result.scalar_one_or_none()
    if not kp:
        raise NotFoundError("knowledge point", str(kp_id))
    return kp


@router.patch("/{kp_id}", response_model=KnowledgePointResponse)
async def update_kp(
    kp_id: UUID,
    data: KnowledgePointUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(KnowledgePoint).where(
            KnowledgePoint.id == kp_id,
            KnowledgePoint.deleted_at.is_(None),
        )
    )
    kp = result.scalar_one_or_none()
    if not kp:
        raise NotFoundError("knowledge point", str(kp_id))

    if data.meaning_zh is not None:
        kp.meaning_zh = data.meaning_zh
    if data.meaning_en is not None:
        kp.meaning_en = data.meaning_en
    if data.explanation_zh is not None:
        kp.explanation_zh = data.explanation_zh
    if data.example_target is not None:
        kp.example_target = data.example_target
    if data.example_zh is not None:
        kp.example_zh = data.example_zh
    if data.metadata is not None:
        kp.metadata_ = data.metadata
    if data.is_verified is not None:
        kp.is_verified = data.is_verified
    await db.flush()
    await db.refresh(kp)
    return kp


@router.delete("/{kp_id}", status_code=204)
async def delete_kp(
    kp_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from datetime import datetime, timezone
    result = await db.execute(
        select(KnowledgePoint).where(
            KnowledgePoint.id == kp_id,
            KnowledgePoint.deleted_at.is_(None),
        )
    )
    kp = result.scalar_one_or_none()
    if not kp:
        raise NotFoundError("knowledge point", str(kp_id))
    kp.deleted_at = datetime.now(timezone.utc)
