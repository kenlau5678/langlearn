from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock

import pytest

from app.services.ingestion_service import _upsert_knowledge_point


@pytest.mark.asyncio
async def test_upsert_refreshes_existing_reference_data():
    existing = SimpleNamespace(
        meaning_zh="待补充",
        meaning_en="placeholder",
        pronunciation=None,
        pos="word",
        metadata_={},
    )
    result = Mock()
    result.scalar_one_or_none.return_value = existing
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
    )

    assert returned is existing
    assert existing.meaning_zh == "建筑；架构"
    assert existing.meaning_en == "the design and structure of a building or system"
    assert existing.pronunciation == "ˈɑːrkɪtektʃər"
    assert existing.pos == "noun"
    assert existing.metadata_ == {"source": "reference"}
