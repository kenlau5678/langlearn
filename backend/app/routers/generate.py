import json
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


class GenerateExercisesRequest(BaseModel):
    knowledge_point_ids: list[str]
    exercise_types: list[str] = ["fill_blank"]
    count_per_kp: int = 3
    proficiency_level: str
    level_system: str = "jlpt"


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
    lang_name = "日语" if request.target_language == "ja" else "英语"
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


@router.post("/exercises")
async def generate_exercises(
    request: GenerateExercisesRequest,
    current_user: User = Depends(get_current_user),
):
    """Generate practice exercises for given knowledge points via SSE stream."""
    lang_name = "日语" if "jlpt" in request.level_system.lower() else "英语"
    level_system = "JLPT" if "jlpt" in request.level_system.lower() else "IELTS"

    messages = [
        {"role": "system", "content": (
            f"你是一位{lang_name}练习题出题专家。"
            f"请根据{level_system} {request.proficiency_level}级别生成练习题。"
            f"题目用{lang_name}，答案和解释用中文。"
        )},
        {"role": "user", "content": (
            f"请生成{request.count_per_kp}道{', '.join(request.exercise_types)}类型的练习题。\n"
            f"级别: {level_system} {request.proficiency_level}\n\n"
            f"每道题包含:\n"
            f"1. 题目\n"
            f"2. 选项（如适用）\n"
            f"3. 正确答案\n"
            f"4. 中文解析\n"
        )},
    ]

    return StreamingResponse(
        llm_service.stream_completion(messages),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
