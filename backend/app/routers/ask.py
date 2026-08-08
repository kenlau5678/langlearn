from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.models.user import User
from app.services.auth_service import get_current_user
from app.services import llm_service

router = APIRouter()


class ExplainGrammarRequest(BaseModel):
    material_chunk_id: str | None = None
    char_offset_start: int | None = None
    char_offset_end: int | None = None
    selected_text: str
    full_sentence: str | None = None
    question: str | None = None
    target_language: str = "ja"


class TranslateRequest(BaseModel):
    text: str
    source_language: str = "auto"
    target_language: str = "zh"


class BreakdownRequest(BaseModel):
    text: str
    target_language: str = "ja"  # or "en"


class CompareRequest(BaseModel):
    text: str
    language_a: str = "ja"
    language_b: str = "en"


class ChatRequest(BaseModel):
    article_title: str | None = None
    article_content: str
    question: str
    target_language: str = "en"  # language of the article


@router.post("/chat")
async def chat_about_article(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
):
    """General Q&A about an article — SSE stream in Chinese."""
    lang_name = "日语" if request.target_language == "ja" else "英语"
    messages = [
        {
            "role": "system",
            "content": (
                f"你是一位专业的{lang_name}阅读助教，正在帮助中国学习者理解文章。"
                "请根据提供的文章回答问题，用中文回答，解释要清晰、简洁、适合学习者理解。"
            ),
        },
        {
            "role": "user",
            "content": (
                f"文章标题：{request.article_title or '无标题'}\n\n"
                f"文章内容：\n{request.article_content}\n\n"
                f"问题：{request.question}"
            ),
        },
    ]
    return StreamingResponse(
        llm_service.stream_completion(messages, temperature=0.7),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.post("/explain-grammar")
async def explain_grammar(
    request: ExplainGrammarRequest,
    current_user: User = Depends(get_current_user),
):
    """Explain grammar in context — SSE stream in Chinese."""
    return StreamingResponse(
        llm_service.stream_explain_grammar(
            selected_text=request.selected_text,
            full_sentence=request.full_sentence,
            target_language=request.target_language,
            question=request.question,
        ),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.post("/translate")
async def translate(
    request: TranslateRequest,
    current_user: User = Depends(get_current_user),
):
    """Translate text — SSE stream."""
    return StreamingResponse(
        llm_service.stream_translate(
            text=request.text,
            source_language=request.source_language,
            target_language=request.target_language,
        ),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.post("/breakdown")
async def breakdown(
    request: BreakdownRequest,
    current_user: User = Depends(get_current_user),
):
    """Sentence breakdown — SSE stream in Chinese."""
    return StreamingResponse(
        llm_service.stream_breakdown(
            text=request.text,
            target_language=request.target_language,
        ),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.post("/compare")
async def compare(
    request: CompareRequest,
    current_user: User = Depends(get_current_user),
):
    """Cross-language grammar comparison — SSE stream in Chinese."""
    return StreamingResponse(
        llm_service.stream_compare(
            text=request.text,
            language_a=request.language_a,
            language_b=request.language_b,
        ),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
