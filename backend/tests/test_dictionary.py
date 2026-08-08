import pytest

from app.routers.dictionary import load_dictionary, load_ielts_vocabulary, lookup_word


def test_english_dictionary_has_common_reading_words():
    entries = load_dictionary()

    assert len(entries) >= 20_000
    assert entries["office"]["meaning_zh"]
    assert entries["employment"]["meaning_en"]
    assert entries["widespread"]["pronunciation"]


def test_ielts_vocabulary_is_ready_for_review_cards():
    entries = load_ielts_vocabulary()

    assert len(entries) >= 2_000
    assert entries[0]["word"]
    assert entries[0]["cefr"] in {"B2", "C1", "C2"}


@pytest.mark.asyncio
async def test_dictionary_lookup_normalizes_selected_text():
    result = await lookup_word(" Employment! ", current_user=None)

    assert result["data"]["surface_form"] == "employment"
