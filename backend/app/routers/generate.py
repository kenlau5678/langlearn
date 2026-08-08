from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.models.user import User
from app.services.auth_service import get_current_user
from app.services import llm_service

router = APIRouter()


class GenerateMaterialRequest(BaseModel):
    target_language: str  # 'en' or 'ja'
    topic: str
    material_type: str = "article"  # article, dialogue, exercise_set
    proficiency_level: str
    level_system: str = "jlpt"
    chunk_count: int = 5


class GenerateLessonRequest(BaseModel):
    """Generate a short fragment-time learning lesson."""
    target_language: str  # 'en' or 'ja'
    lesson_type: str = "mixed"  # vocab, reading, grammar, mixed
    proficiency_level: str
    level_system: str = "jlpt"
    topic: str | None = None  # optional topic focus


@router.post("/material")
async def generate_material(
    request: GenerateMaterialRequest,
    current_user: User = Depends(get_current_user),
):
    """Generate level-appropriate material via SSE stream."""
    return StreamingResponse(
        llm_service.stream_generate_material(
            target_language=request.target_language,
            topic=request.topic,
            proficiency_level=request.proficiency_level,
            material_type=request.material_type,
            chunk_count=request.chunk_count,
        ),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.post("/lesson")
async def generate_lesson(
    request: GenerateLessonRequest,
    current_user: User = Depends(get_current_user),
):
    """Generate a short fragment-time lesson via SSE stream.

    Lesson types:
    - vocab: 5 vocabulary cards with examples
    - reading: short reading passage with key vocab highlighted
    - grammar: grammar pattern explanation with examples
    - mixed: a little of everything (default)
    """
    level_system = "JLPT" if request.target_language == "ja" else "IELTS"
    topic_hint = f"主题: {request.topic}\n" if request.topic else ""

    reading_prompt = (
        f"Write a {level_system} Band {request.proficiency_level} English reading passage "
        f"of about 300-350 words (4 paragraphs).\n"
        f"{topic_hint}"
        f"Rules:\n"
        f"- Output ONLY the article in clean Markdown. No Chinese anywhere.\n"
        f"- Give the article a # Heading title.\n"
        f"- Bold (**word**) exactly 6-10 important vocabulary words or phrases that "
        f"a learner at this level should study. Choose words that are academically "
        f"useful, appear in IELTS/TOEFL, or represent advanced grammar patterns.\n"
        f"- Do NOT add translations, glossaries, footnotes, or any Chinese text.\n"
        f"- Write naturally flowing paragraphs."
    )

    messages = [
        {"role": "system", "content": (
            f"You are an expert English language teacher creating IELTS-level reading "
            f"materials. Respond ONLY in English. Never include Chinese or translations."
        )},
        {"role": "user", "content": reading_prompt},
    ]

    return StreamingResponse(
        llm_service.stream_completion(messages, temperature=0.8),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
