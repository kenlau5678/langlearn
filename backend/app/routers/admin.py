"""Admin endpoints for bulk reference-data ingestion."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.services.auth_service import get_current_user
from app.services.ingestion_service import (
    ingest_vocabulary,
    ingest_grammar,
    ingest_kanji,
    ingest_all,
)

router = APIRouter()


@router.post("/ingest/vocabulary")
async def ingest_vocab(
    file_path: str | None = Query(None, description="Custom JSON file path"),
    target_language: str = Query("ja", description="Target language code"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Bulk ingest vocabulary from JSON reference data."""
    result = await ingest_vocabulary(db, file_path=file_path, target_language=target_language)
    return {"message": "词汇导入完成", "data": result}


@router.post("/ingest/kanji")
async def ingest_kanji_data(
    file_path: str | None = Query(None, description="Custom JSON file path"),
    target_language: str = Query("ja"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Bulk ingest kanji reference data from JSON."""
    result = await ingest_kanji(db, file_path=file_path, target_language=target_language)
    return {"message": "汉字导入完成", "data": result}


@router.post("/ingest/grammar")
async def ingest_grammar_data(
    file_path: str | None = Query(None, description="Custom JSON file path"),
    target_language: str = Query("ja"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Bulk ingest grammar patterns from JSON."""
    result = await ingest_grammar(db, file_path=file_path, target_language=target_language)
    return {"message": "语法导入完成", "data": result}


@router.post("/ingest/all")
async def ingest_all_data(
    target_language: str = Query("ja", description="Target language"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Run full ingestion: vocabulary + grammar + kanji."""
    result = await ingest_all(db, target_language=target_language)
    return {"message": "全部数据导入完成", "data": result}


@router.get("/ingest/status")
async def ingestion_status(current_user: User = Depends(get_current_user)):
    """Get current ingestion job status."""
    return {
        "jobs": [],
        "message": "Ingestion status tracking — use /ingest/all to start a pipeline.",
    }
