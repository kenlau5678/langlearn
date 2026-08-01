"""Japanese tokenizer service using SudachiPy + jaconv utilities."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Sequence

import jaconv
from sudachipy import tokenizer as sudachi_tokenizer
from sudachipy import dictionary as sudachi_dictionary


@dataclass
class Token:
    """Single morphological token from Japanese text."""

    surface: str
    reading: str  # katakana
    reading_hiragana: str
    lemma: str
    pos: str  # part-of-speech (simplified)
    pos_detail: str
    normalized: str
    start: int = 0
    end: int = 0


@dataclass
class TokenizerResult:
    """Result of tokenizing a Japanese sentence."""

    text: str
    tokens: list[Token] = field(default_factory=list)

    @property
    def surfaces(self) -> list[str]:
        return [t.surface for t in self.tokens]

    @property
    def lemmas(self) -> list[str]:
        return [t.lemma for t in self.tokens]

    @property
    def readings(self) -> list[str]:
        return [t.reading_hiragana for t in self.tokens]


class JapaneseTokenizer:
    """Wrapper around SudachiPy for Japanese morphological analysis."""

    # SudachiPy split modes: A (short), B (middle), C (long / named-entity)
    SPLIT_MODES = {
        "A": sudachi_tokenizer.Tokenizer.SplitMode.A,
        "B": sudachi_tokenizer.Tokenizer.SplitMode.B,
        "C": sudachi_tokenizer.Tokenizer.SplitMode.C,
    }

    def __init__(self, split_mode: str = "B"):
        self._dict = sudachi_dictionary.Dictionary()
        mode = self.SPLIT_MODES.get(split_mode, sudachi_tokenizer.Tokenizer.SplitMode.B)
        self._tokenizer = self._dict.create(mode=mode)

    def tokenize(self, text: str) -> TokenizerResult:
        """Tokenize Japanese text and return structured tokens."""
        result = TokenizerResult(text=text)
        if not text.strip():
            return result

        morphemes = self._tokenizer.tokenize(text)
        offset = 0
        for m in morphemes:
            surface = m.surface()
            reading_kata = m.reading_form() if m.reading_form() else surface
            reading_hira = jaconv.kata2hira(reading_kata)
            lemma = m.normalized_form() if m.normalized_form() else m.dictionary_form()
            pos_parts = m.part_of_speech()
            pos = pos_parts[0] if pos_parts else "unknown"
            pos_detail = "/".join(pos_parts[:4]) if pos_parts else "unknown"
            normalized = m.normalized_form() if m.normalized_form() else surface

            start = offset
            end = offset + len(surface)
            offset = end

            result.tokens.append(Token(
                surface=surface,
                reading=reading_kata,
                reading_hiragana=reading_hira,
                lemma=lemma,
                pos=pos,
                pos_detail=pos_detail,
                normalized=normalized,
                start=start,
                end=end,
            ))

        return result

    def extract_content_words(self, text: str) -> list[Token]:
        """Extract content words (nouns, verbs, adjectives, adverbs)."""
        result = self.tokenize(text)
        content_pos = {"名詞", "動詞", "形容詞", "副詞"}
        return [t for t in result.tokens if t.pos in content_pos]

    def extract_vocabulary_candidates(self, text: str) -> list[Token]:
        """Extract tokens that could be vocabulary items (nouns, verb lemmas, adj lemmas)."""
        result = self.tokenize(text)
        candidates: list[Token] = []
        for t in result.tokens:
            if t.pos == "名詞" and len(t.surface) > 0:
                candidates.append(t)
            elif t.pos in {"動詞", "形容詞"} and t.lemma != t.surface:
                # Include lemma form for verbs/adjectives (dictionary form)
                candidates.append(t)
        return candidates

    def wakachi(self, text: str) -> str:
        """Return space-separated tokenized text (分かち書き)."""
        result = self.tokenize(text)
        return " ".join(result.surfaces)


def normalize_text(text: str) -> str:
    """Normalize Japanese text: fullwidth→halfwidth, normalize unicode."""
    text = jaconv.normalize(text)
    return text


def to_hiragana(text: str) -> str:
    """Convert katakana/romaji to hiragana."""
    return jaconv.kata2hira(jaconv.alphabet2kana(text))


def to_katakana(text: str) -> str:
    """Convert hiragana to katakana."""
    return jaconv.hira2kata(text)


def to_romaji(text: str) -> str:
    """Convert kana to romaji (Hepburn-style approximation)."""
    return jaconv.kana2alphabet(text)


# Singleton tokenizer instance (lazy init)
_tokenizer_instance: JapaneseTokenizer | None = None


def get_tokenizer() -> JapaneseTokenizer:
    """Get or create the singleton tokenizer instance."""
    global _tokenizer_instance
    if _tokenizer_instance is None:
        _tokenizer_instance = JapaneseTokenizer()
    return _tokenizer_instance
