"""English tokenizer service using spaCy."""

from __future__ import annotations

from dataclasses import dataclass, field

import spacy
from spacy.tokens import Doc


@dataclass
class EnToken:
    """Single token from English text."""

    surface: str
    lemma: str
    pos: str  # universal POS tag (NOUN, VERB, ADJ, etc.)
    tag: str  # detailed POS tag (NN, VBD, JJ, etc.)
    dep: str  # dependency relation
    is_stop: bool
    is_punct: bool
    start: int = 0
    end: int = 0


@dataclass
class EnTokenizerResult:
    """Result of tokenizing English text."""

    text: str
    tokens: list[EnToken] = field(default_factory=list)

    @property
    def surfaces(self) -> list[str]:
        return [t.surface for t in self.tokens]

    @property
    def lemmas(self) -> list[str]:
        return [t.lemma for t in self.tokens if not t.is_punct]

    @property
    def sentences(self) -> list[str]:
        """Reconstruct sentences from the doc."""
        return [sent.text.strip() for sent in self._doc.sents] if self._doc else []

    def __post_init__(self):
        self._doc: Doc | None = None


class EnglishTokenizer:
    """Wrapper around spaCy for English NLP processing."""

    def __init__(self, model: str = "en_core_web_sm"):
        try:
            self._nlp = spacy.load(model)
        except OSError:
            # Fall back to smaller model or raise helpful error
            raise RuntimeError(
                f"spaCy model '{model}' not found. Install with: "
                f"python -m spacy download {model}"
            )

    def tokenize(self, text: str) -> EnTokenizerResult:
        """Tokenize English text and return structured tokens."""
        result = EnTokenizerResult(text=text)
        if not text.strip():
            return result

        doc = self._nlp(text)
        result._doc = doc

        for token in doc:
            result.tokens.append(EnToken(
                surface=token.text,
                lemma=token.lemma_,
                pos=token.pos_,
                tag=token.tag_,
                dep=token.dep_,
                is_stop=token.is_stop,
                is_punct=token.is_punct,
                start=token.idx,
                end=token.idx + len(token.text),
            ))

        return result

    def extract_content_words(self, text: str) -> list[EnToken]:
        """Extract content words (nouns, verbs, adjectives, adverbs)."""
        result = self.tokenize(text)
        content_pos = {"NOUN", "VERB", "ADJ", "ADV", "PROPN"}
        return [t for t in result.tokens if t.pos in content_pos and not t.is_stop]

    def extract_vocabulary_candidates(self, text: str) -> list[EnToken]:
        """Extract tokens that could be vocabulary items for learners."""
        result = self.tokenize(text)
        candidates: list[EnToken] = []
        seen: set[str] = set()
        for t in result.tokens:
            if t.is_punct or t.is_stop:
                continue
            if t.pos in {"NOUN", "VERB", "ADJ", "ADV"} and t.lemma not in seen:
                seen.add(t.lemma)
                candidates.append(t)
        return candidates

    def extract_noun_phrases(self, text: str) -> list[str]:
        """Extract noun phrases from text."""
        doc = self._nlp(text)
        return [chunk.text for chunk in doc.noun_chunks]

    def get_sentence_count(self, text: str) -> int:
        """Count sentences in text."""
        doc = self._nlp(text)
        return sum(1 for _ in doc.sents)

    def get_word_count(self, text: str) -> int:
        """Count words (excluding punctuation)."""
        doc = self._nlp(text)
        return sum(1 for t in doc if not t.is_punct and not t.is_space)


# Singleton tokenizer instance (lazy init)
_tokenizer_instance: EnglishTokenizer | None = None


def get_en_tokenizer(model: str = "en_core_web_sm") -> EnglishTokenizer:
    """Get or create the singleton English tokenizer instance."""
    global _tokenizer_instance
    if _tokenizer_instance is None:
        _tokenizer_instance = EnglishTokenizer(model=model)
    return _tokenizer_instance
