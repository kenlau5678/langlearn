"""Furigana generation for Japanese text using SudachiPy + jaconv."""

from __future__ import annotations

from dataclasses import dataclass

import jaconv

from app.nlp.tokenizer import get_tokenizer, Token


@dataclass
class FuriganaSegment:
    """A text segment with optional furigana annotation."""

    text: str
    furigana: str | None = None  # hiragana reading, only for kanji-containing tokens

    @property
    def has_furigana(self) -> bool:
        return self.furigana is not None and self.furigana != self.text


@dataclass
class FuriganaResult:
    """Full furigana annotation result for a text."""

    text: str
    segments: list[FuriganaSegment]

    def to_html(self) -> str:
        """Render as HTML with <ruby> tags."""
        parts: list[str] = []
        for seg in self.segments:
            if seg.has_furigana:
                parts.append(
                    f"<ruby>{seg.text}<rp>(</rp><rt>{seg.furigana}</rt><rp>)</rp></ruby>"
                )
            else:
                parts.append(seg.text)
        return "".join(parts)

    def to_bracket(self) -> str:
        """Render as bracket notation: 漢字[かんじ]."""
        parts: list[str] = []
        for seg in self.segments:
            if seg.has_furigana:
                parts.append(f"{seg.text}[{seg.furigana}]")
            else:
                parts.append(seg.text)
        return "".join(parts)

    def to_reading_text(self) -> str:
        """Return full reading in hiragana (space-separated)."""
        parts: list[str] = []
        for seg in self.segments:
            parts.append(seg.furigana if seg.furigana else seg.text)
        return "".join(parts)


def _contains_kanji(text: str) -> bool:
    """Check if text contains any kanji characters."""
    for ch in text:
        cp = ord(ch)
        # CJK Unified Ideographs ranges
        if (0x4E00 <= cp <= 0x9FFF or
            0x3400 <= cp <= 0x4DBF or
            0x20000 <= cp <= 0x2A6DF or
            0xF900 <= cp <= 0xFAFF):
            return True
    return False


def generate_furigana(text: str) -> FuriganaResult:
    """Generate furigana annotations for Japanese text.

    Uses SudachiPy to tokenize and extract readings, then pairs
    kanji-containing tokens with their hiragana readings.
    """
    tokenizer = get_tokenizer()
    result = tokenizer.tokenize(text)
    segments: list[FuriganaSegment] = []

    for token in result.tokens:
        if _contains_kanji(token.surface):
            # Use hiragana reading for kanji tokens
            reading = token.reading_hiragana
            # If reading is same as surface (no kanji conversion needed), skip
            if reading != token.surface:
                segments.append(FuriganaSegment(text=token.surface, furigana=reading))
            else:
                segments.append(FuriganaSegment(text=token.surface))
        else:
            # Non-kanji tokens (hiragana, katakana, latin, etc.)
            segments.append(FuriganaSegment(text=token.surface))

    return FuriganaResult(text=text, segments=segments)


def generate_furigana_batch(texts: list[str]) -> list[FuriganaResult]:
    """Generate furigana for multiple texts."""
    return [generate_furigana(text) for text in texts]


def get_reading(text: str) -> str:
    """Get the full hiragana reading for Japanese text."""
    result = generate_furigana(text)
    return result.to_reading_text()


def to_furigana_html(text: str) -> str:
    """Convenience: generate furigana HTML for a single text."""
    return generate_furigana(text).to_html()
