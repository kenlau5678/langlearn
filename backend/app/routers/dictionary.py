import json
import re
from functools import lru_cache
from pathlib import Path

from fastapi import APIRouter, Depends, Query, Response

from app.models.user import User
from app.services.auth_service import get_current_user


router = APIRouter()
DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "english_dictionary.json"
IELTS_VOCAB_PATH = Path(__file__).resolve().parents[2] / "data" / "ielts_vocabulary.json"


@lru_cache(maxsize=1)
def load_dictionary() -> dict[str, dict]:
    return json.loads(DATA_PATH.read_text(encoding="utf-8"))


@lru_cache(maxsize=1)
def load_ielts_vocabulary() -> list[dict]:
    entries = json.loads(IELTS_VOCAB_PATH.read_text(encoding="utf-8"))
    return [
        {
            "word": entry["surface_form"],
            "pronunciation": entry.get("pronunciation") or "",
            "pos": entry.get("pos") or "",
            "meaning_zh": entry.get("meaning_zh") or "",
            "meaning_en": entry.get("meaning_en") or "",
            "example": (entry.get("example_target") or [""])[0],
            "example_zh": (entry.get("example_zh") or [""])[0],
            "band": entry.get("proficiency_level") or "6.5",
            "cefr": entry.get("metadata", {}).get("cefr") or "B2",
            "frequency_band": entry.get("metadata", {}).get("frequency_band") or "",
            "frequency_rank": entry.get("metadata", {}).get("frequency_rank"),
            "topic": entry.get("metadata", {}).get("topic") or "综合学术",
        }
        for entry in entries
    ]


@router.get("/lookup")
async def lookup_word(
    word: str = Query(..., min_length=1, max_length=100),
    current_user: User = Depends(get_current_user),
):
    normalized = re.sub(r"^[^a-z]+|[^a-z'-]+$", "", word.strip().lower())
    return {"data": load_dictionary().get(normalized)}


@router.get("/ielts-vocabulary")
async def list_ielts_vocabulary(
    response: Response,
    current_user: User = Depends(get_current_user),
):
    response.headers["Cache-Control"] = "private, max-age=86400"
    return {"data": load_ielts_vocabulary()}
