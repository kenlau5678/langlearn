"""Text chunking service for splitting material text into manageable pieces."""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class TextChunk:
    """A single chunk of text from a material."""

    index: int
    text: str
    chunk_type: str = "paragraph"  # paragraph, sentence, section
    char_offset_start: int = 0
    char_offset_end: int = 0
    token_estimate: int = 0


def estimate_tokens(text: str) -> int:
    """Rough token count estimate (~0.75 tokens per char for English, ~1.5 for CJK)."""
    cjk_chars = sum(1 for c in text if '\u4e00' <= c <= '\u9fff' or '\u3040' <= c <= '\u30ff')
    other_chars = len(text) - cjk_chars
    return int(cjk_chars * 1.5 + other_chars * 0.3)


def chunk_by_paragraphs(
    text: str,
    max_chunk_tokens: int = 500,
    min_chunk_tokens: int = 50,
) -> list[TextChunk]:
    """Split text into paragraph-sized chunks.

    Merges short paragraphs up to max_chunk_tokens,
    splits long paragraphs at sentence boundaries.
    """
    paragraphs = _split_paragraphs(text)
    chunks: list[TextChunk] = []
    current_text = ""
    current_start = 0
    idx = 0

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue

        para_tokens = estimate_tokens(para)
        combined = (current_text + "\n\n" + para).strip() if current_text else para
        combined_tokens = estimate_tokens(combined)

        if combined_tokens <= max_chunk_tokens:
            if not current_text:
                current_start = text.find(para, current_start)
            current_text = combined
        else:
            # Flush current chunk
            if current_text:
                chunks.append(TextChunk(
                    index=idx,
                    text=current_text,
                    chunk_type="paragraph",
                    char_offset_start=current_start,
                    char_offset_end=current_start + len(current_text),
                    token_estimate=estimate_tokens(current_text),
                ))
                idx += 1

            # If paragraph itself is too large, split by sentences
            if para_tokens > max_chunk_tokens:
                sent_chunks = _split_sentences(para)
                current_text = ""
                current_start = text.find(para, current_start)
                sent_buffer = ""

                for sent in sent_chunks:
                    sent = sent.strip()
                    if not sent:
                        continue
                    combined_sent = (sent_buffer + " " + sent).strip() if sent_buffer else sent
                    if estimate_tokens(combined_sent) <= max_chunk_tokens:
                        sent_buffer = combined_sent
                    else:
                        if sent_buffer:
                            chunks.append(TextChunk(
                                index=idx,
                                text=sent_buffer,
                                chunk_type="sentence_group",
                                char_offset_start=current_start,
                                char_offset_end=current_start + len(sent_buffer),
                                token_estimate=estimate_tokens(sent_buffer),
                            ))
                            idx += 1
                        sent_buffer = sent
                current_text = sent_buffer
            else:
                current_start = text.find(para, current_start)
                current_text = para

    # Flush remaining
    if current_text.strip():
        chunks.append(TextChunk(
            index=idx,
            text=current_text,
            chunk_type="paragraph",
            char_offset_start=current_start,
            char_offset_end=current_start + len(current_text),
            token_estimate=estimate_tokens(current_text),
        ))

    return chunks


def chunk_by_sentences(text: str, target_language: str = "ja") -> list[TextChunk]:
    """Split text into individual sentence chunks."""
    sentences = _split_sentences(text) if target_language == "en" else _split_sentences_ja(text)
    chunks: list[TextChunk] = []
    offset = 0

    for idx, sent in enumerate(sentences):
        sent = sent.strip()
        if not sent:
            continue
        start = text.find(sent, offset)
        if start == -1:
            start = offset
        chunks.append(TextChunk(
            index=idx,
            text=sent,
            chunk_type="sentence",
            char_offset_start=start,
            char_offset_end=start + len(sent),
            token_estimate=estimate_tokens(sent),
        ))
        offset = start + len(sent)

    return chunks


def _split_paragraphs(text: str) -> list[str]:
    """Split text by paragraph breaks (double newline or more)."""
    return re.split(r'\n\s*\n', text)


def _split_sentences(text: str) -> list[str]:
    """Split English text into sentences."""
    # Handle common abbreviations
    text = re.sub(r'(?<=[.!?])\s+(?=[A-Z])', '\n', text)
    return [s.strip() for s in text.split('\n') if s.strip()]


def _split_sentences_ja(text: str) -> list[str]:
    """Split Japanese text into sentences (by 。！？)."""
    sentences = re.split(r'([。！？])', text)
    result: list[str] = []
    for i in range(0, len(sentences) - 1, 2):
        result.append(sentences[i] + sentences[i + 1])
    if len(sentences) % 2 == 1 and sentences[-1].strip():
        result.append(sentences[-1])
    return [s for s in result if s.strip()]
