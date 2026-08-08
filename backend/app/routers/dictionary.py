import json
import re
from functools import lru_cache
from pathlib import Path

from fastapi import APIRouter, Depends, Query

from app.models.user import User
from app.services.auth_service import get_current_user


router = APIRouter()
DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "english_dictionary.json"


@lru_cache(maxsize=1)
def load_dictionary() -> dict[str, dict]:
    return json.loads(DATA_PATH.read_text(encoding="utf-8"))


@router.get("/lookup")
async def lookup_word(
    word: str = Query(..., min_length=1, max_length=100),
    current_user: User = Depends(get_current_user),
):
    normalized = re.sub(r"^[^a-z]+|[^a-z'-]+$", "", word.strip().lower())
    return {"data": load_dictionary().get(normalized)}
