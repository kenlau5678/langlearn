"""Admin endpoints for bulk data ingestion, graph generation, and embeddings."""

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
from app.services.graph_service import generate_all_edges
from app.services.embedding_service import generate_embeddings_batch

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


@router.post("/graph/generate")
async def generate_graph(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Auto-generate knowledge graph edges (CONTAINS_KANJI, PREREQUISITE_OF, RELATED_TO)."""
    result = await generate_all_edges(db)
    return {"message": "知识图谱边生成完成", "data": result}


@router.post("/embeddings/generate")
async def generate_embeddings(
    target_language: str | None = Query(None),
    kp_type: str | None = Query(None),
    limit: int | None = Query(None, description="Max KPs to process"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generate OpenAI embeddings for knowledge points missing them."""
    result = await generate_embeddings_batch(
        db,
        target_language=target_language,
        kp_type=kp_type,
        limit=limit,
    )
    return {"message": "向量生成完成", "data": result}


@router.post("/ingest/full-pipeline")
async def run_full_pipeline(
    target_language: str = Query("ja"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Run complete data pipeline: ingest → graph → embeddings."""
    # Step 1: Ingest data
    ingest_result = await ingest_all(db, target_language=target_language)

    # Step 2: Generate graph edges
    graph_result = await generate_all_edges(db)

    # Step 3: Generate embeddings (skip if no API key)
    embed_result = await generate_embeddings_batch(db, target_language=target_language)

    return {
        "message": "完整管线执行完成",
        "ingest": ingest_result,
        "graph": graph_result,
        "embeddings": embed_result,
    }


@router.get("/ingest/status")
async def ingestion_status(current_user: User = Depends(get_current_user)):
    """Get current ingestion job status."""
    return {
        "jobs": [],
        "message": "Ingestion status tracking — use /ingest/all to start a pipeline.",
    }
