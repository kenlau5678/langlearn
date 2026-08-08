import pytest

from app.routers.dictionary import load_dictionary, lookup_word


def test_english_dictionary_has_common_reading_words():
    entries = load_dictionary()

    assert len(entries) >= 20_000
    assert entries["office"]["meaning_zh"]
    assert entries["employment"]["meaning_en"]
    assert entries["widespread"]["pronunciation"]


@pytest.mark.asyncio
async def test_dictionary_lookup_normalizes_selected_text():
    result = await lookup_word(" Employment! ", current_user=None)

    assert result["data"]["surface_form"] == "employment"
