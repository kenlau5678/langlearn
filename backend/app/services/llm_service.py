"""LLM streaming service — shared OpenAI integration for all SSE endpoints."""

from __future__ import annotations

import json
import logging
from typing import AsyncGenerator

from openai import AsyncOpenAI

from app.config import get_settings

logger = logging.getLogger(__name__)

_settings = get_settings()

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=_settings.openai_api_key)
    return _client


def _has_api_key() -> bool:
    return bool(_settings.openai_api_key) and _settings.openai_api_key != "changeme"


async def stream_completion(
    messages: list[dict[str, str]],
    model: str | None = None,
    max_tokens: int | None = None,
    temperature: float = 0.7,
) -> AsyncGenerator[str, None]:
    """Stream an OpenAI chat completion as SSE events.

    Yields SSE-formatted lines: 'data: {...}\n\n'
    Each event has: {"type": "token"|"done"|"error", "content": "..."}
    """
    if not _has_api_key():
        yield f"data: {json.dumps({'type': 'error', 'content': 'OpenAI API密钥未配置，请在.env中设置OPENAI_API_KEY'}, ensure_ascii=False)}\n\n"
        return

    client = _get_client()
    model = model or _settings.openai_chat_model
    max_tokens = max_tokens or _settings.openai_max_tokens

    try:
        stream = await client.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
            stream=True,
        )

        async for chunk in stream:
            delta = chunk.choices[0].delta
            if delta.content:
                yield f"data: {json.dumps({'type': 'token', 'content': delta.content}, ensure_ascii=False)}\n\n"

        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    except Exception as e:
        logger.error(f"LLM streaming error: {e}")
        yield f"data: {json.dumps({'type': 'error', 'content': f'AI响应出错: {str(e)}'}, ensure_ascii=False)}\n\n"


async def stream_explain_grammar(
    selected_text: str,
    full_sentence: str | None,
    target_language: str,
    question: str | None = None,
) -> AsyncGenerator[str, None]:
    """Stream a grammar explanation in Chinese."""
    context = f"完整句子: {full_sentence}" if full_sentence else ""
    user_msg = (
        f"你是一位语言学习助手。请用中文解释以下{'日语' if target_language == 'ja' else '英语'}文本中的语法:\n\n"
        f"选中文本: 「{selected_text}」\n"
        f"{context}\n\n"
    )
    if question:
        user_msg += f"学习者追问: {question}\n\n"
    user_msg += (
        "请详细解释:\n"
        "1. 选中部分的语法结构和用法\n"
        "2. 与其他类似语法形式的区别\n"
        "3. 常见错误和使用建议\n"
        "用简洁的中文回答，适合中国学习者理解。"
    )

    messages = [
        {"role": "system", "content": "你是一位专业的语言学习导师，用中文为学习者解释语法。回答要准确、实用、易懂。"},
        {"role": "user", "content": user_msg},
    ]

    async for event in stream_completion(messages):
        yield event


async def stream_translate(
    text: str,
    source_language: str = "auto",
    target_language: str = "zh",
) -> AsyncGenerator[str, None]:
    """Stream a translation with context."""
    lang_names = {"ja": "日语", "en": "英语", "zh": "中文", "auto": "自动检测"}
    src_name = lang_names.get(source_language, source_language)
    tgt_name = lang_names.get(target_language, target_language)

    messages = [
        {"role": "system", "content": f"你是一位专业翻译。将文本从{src_name}翻译成{tgt_name}，并提供翻译解析。"},
        {"role": "user", "content": (
            f"请翻译以下文本:\n\n{text}\n\n"
            f"要求:\n"
            f"1. 先给出翻译结果\n"
            f"2. 解释关键词汇和表达\n"
            f"3. 如有多种翻译方式，简要说明区别\n"
            f"用中文回答。"
        )},
    ]

    async for event in stream_completion(messages):
        yield event


async def stream_breakdown(
    text: str,
    target_language: str,
) -> AsyncGenerator[str, None]:
    """Stream a sentence breakdown in Chinese."""
    lang_name = "日语" if target_language == "ja" else "英语"

    messages = [
        {"role": "system", "content": "你是一位语言学习助手，用中文帮助学习者逐句分析文本结构。"},
        {"role": "user", "content": (
            f"请逐词分析以下{lang_name}句子:\n\n{text}\n\n"
            f"对每个词/短语:\n"
            f"1. 标注词性\n"
            f"2. 给出中文含义\n"
            f"3. 说明语法功能\n"
            f"然后给出整句中文翻译和语法结构总结。"
        )},
    ]

    async for event in stream_completion(messages):
        yield event


async def stream_generate_material(
    target_language: str,
    topic: str,
    proficiency_level: str,
    material_type: str = "article",
    chunk_count: int = 5,
) -> AsyncGenerator[str, None]:
    """Stream AI-generated learning material."""
    lang_name = "日语" if target_language == "ja" else "英语"
    level_system = "JLPT" if target_language == "ja" else "IELTS"

    messages = [
        {"role": "system", "content": (
            f"你是一位{lang_name}教学材料编写专家。"
            f"请根据{level_system} {proficiency_level}级别编写学习材料。"
            f"材料用{lang_name}写，所有解释和注释用中文。"
        )},
        {"role": "user", "content": (
            f"主题: {topic}\n"
            f"类型: {material_type}\n"
            f"级别: {level_system} {proficiency_level}\n"
            f"段落数: 约{chunk_count}段\n\n"
            f"请生成一篇适合该级别的学习材料，包含:\n"
            f"1. 正文（用目标语言）\n"
            f"2. 重点词汇列表（含中文释义）\n"
            f"3. 语法要点（含中文解释）"
        )},
    ]

    async for event in stream_completion(messages):
        yield event


async def stream_compare(
    text: str,
    language_a: str = "ja",
    language_b: str = "en",
) -> AsyncGenerator[str, None]:
    """Stream a cross-language comparison in Chinese."""
    lang_a = "日语" if language_a == "ja" else "英语"
    lang_b = "日语" if language_b == "ja" else "英语"

    messages = [
        {"role": "system", "content": "你是一位双语教学专家，帮助中国学习者对比理解日语和英语的语法差异。"},
        {"role": "user", "content": (
            f"请对比分析以下语法点在{lang_a}和{lang_b}中的表达差异:\n\n{text}\n\n"
            f"请用中文回答:\n"
            f"1. 分别给出{lang_a}和{lang_b}的表达方式\n"
            f"2. 对比两者的语法结构差异\n"
            f"3. 对中国学习者的建议"
        )},
    ]

    async for event in stream_completion(messages):
        yield event
