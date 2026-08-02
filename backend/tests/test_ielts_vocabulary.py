import json
from pathlib import Path


def test_ielts_vocabulary_is_large_and_complete():
    data_path = Path(__file__).parents[1] / "data" / "ielts_vocabulary.json"
    entries = json.loads(data_path.read_text(encoding="utf-8"))
    words = [entry["surface_form"].lower() for entry in entries]

    assert len(entries) >= 2000
    assert len(words) == len(set(words))
    assert all(entry["meaning_zh"].strip() for entry in entries)
    assert all(entry["meaning_en"].strip() for entry in entries)
    assert all(entry["metadata"]["cefr"] in {"B2", "C1", "C2"} for entry in entries)
    assert all(entry["metadata"]["topic"] for entry in entries)
