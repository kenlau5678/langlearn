import json
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock

import pytest

from app.services import ingestion_service
from app.services.ingestion_service import _upsert_knowledge_point


@pytest.mark.asyncio
async def test_upsert_refreshes_existing_reference_data():
    existing = SimpleNamespace(
        meaning_zh="待补充",
        meaning_en="placeholder",
        pronunciation=None,
        pos="word",
        metadata_={},
        proficiency_level="6.0",
        level_system="jlpt",
        source="jlpt_reference",
        deleted_at=None,
    )
    result = Mock()
    result.scalars.return_value.first.return_value = existing
    db = SimpleNamespace(execute=AsyncMock(return_value=result))

    returned = await _upsert_knowledge_point(
        db,
        {
            "surface_form": "architecture",
            "proficiency_level": "8.5",
            "meaning_zh": "建筑；架构",
            "meaning_en": "the design and structure of a building or system",
            "pronunciation": "ˈɑːrkɪtektʃər",
            "pos": "noun",
            "metadata": {"source": "reference"},
        },
        kp_type="vocabulary",
        target_language="en",
        level_system="ielts",
    )

    assert returned is existing
    assert existing.meaning_zh == "建筑；架构"
    assert existing.meaning_en == "the design and structure of a building or system"
    assert existing.pronunciation == "ˈɑːrkɪtektʃər"
    assert existing.pos == "noun"
    assert existing.metadata_ == {"source": "reference"}
    assert existing.proficiency_level == "8.5"
    assert existing.level_system == "ielts"
    assert existing.source == "ielts_reference"


@pytest.mark.asyncio
async def test_english_ingestion_retires_removed_reference_words(tmp_path, monkeypatch):
    entries = [{
        "surface_form": "mitigate",
        "proficiency_level": "7.5",
        "meaning_zh": "减轻",
    }]
    (tmp_path / "ielts_vocabulary.json").write_text(json.dumps(entries), encoding="utf-8")
    monkeypatch.setattr(ingestion_service, "DATA_DIR", tmp_path)
    monkeypatch.setattr(ingestion_service, "_upsert_knowledge_point", AsyncMock(return_value=SimpleNamespace(id="kept")))

    kept = SimpleNamespace(surface_form="mitigate", deleted_at=None)
    removed = SimpleNamespace(surface_form="planet", deleted_at=None)
    result = Mock()
    result.scalars.return_value.all.return_value = [kept, removed]
    db = SimpleNamespace(execute=AsyncMock(return_value=result))

    summary = await ingestion_service.ingest_vocabulary(db, target_language="en")

    assert summary["removed"] == 1
    assert kept.deleted_at is None
    assert removed.deleted_at is not None
