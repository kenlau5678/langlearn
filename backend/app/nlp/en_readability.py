"""English readability and difficulty scoring using textstat."""

from __future__ import annotations

from dataclasses import dataclass

import textstat


@dataclass
class ReadabilityScores:
    """Collection of readability metrics for a text."""

    text: str
    flesch_reading_ease: float  # 0-100, higher = easier
    flesch_kincaid_grade: float  # US school grade level
    gunning_fog: float  # years of education needed
    smog_index: float  # years of education
    coleman_liau_index: float  # grade level
    automated_readability_index: float  # grade level
    dale_chall_readability_score: float  # grade level
    text_standard: str  # consensus grade (e.g., "6th and 7th grade")
    word_count: int
    sentence_count: int
    avg_sentence_length: float
    syllable_count: int
    ielts_band_estimate: float  # estimated IELTS reading difficulty

    @property
    def difficulty_label(self) -> str:
        """Map readability to a difficulty label for learners."""
        grade = self.flesch_kincaid_grade
        if grade <= 4:
            return "beginner"
        elif grade <= 7:
            return "elementary"
        elif grade <= 10:
            return "intermediate"
        elif grade <= 13:
            return "upper_intermediate"
        else:
            return "advanced"

    @property
    def difficulty_score(self) -> float:
        """Normalized 0-1 difficulty score (0=easy, 1=hard)."""
        # Clamp to 0-1 range based on Flesch-Kincaid grade (0-18)
        return min(1.0, max(0.0, self.flesch_kincaid_grade / 18.0))


def analyze_readability(text: str) -> ReadabilityScores:
    """Compute readability scores for English text."""
    if not text.strip():
        return ReadabilityScores(
            text=text,
            flesch_reading_ease=0.0,
            flesch_kincaid_grade=0.0,
            gunning_fog=0.0,
            smog_index=0.0,
            coleman_liau_index=0.0,
            automated_readability_index=0.0,
            dale_chall_readability_score=0.0,
            text_standard="N/A",
            word_count=0,
            sentence_count=0,
            avg_sentence_length=0.0,
            syllable_count=0,
            ielts_band_estimate=1.0,
        )

    fre = textstat.flesch_reading_ease(text)
    fkg = textstat.flesch_kincaid_grade(text)
    gf = textstat.gunning_fog(text)
    smog = textstat.smog_index(text)
    cli = textstat.coleman_liau_index(text)
    ari = textstat.automated_readability_index(text)
    dcrs = textstat.dale_chall_readability_score(text)
    ts = textstat.text_standard(text, float_output=False)

    word_count = textstat.lexicon_count(text)
    sentence_count = textstat.sentence_count(text) or 1
    avg_sent_len = word_count / sentence_count
    syllable_count = textstat.syllable_count(text)

    # Estimate IELTS band from Flesch-Kincaid grade
    # Grade 4-6 ≈ IELTS 4.0, Grade 7-9 ≈ IELTS 5.0-5.5,
    # Grade 10-12 ≈ IELTS 6.0-6.5, Grade 13+ ≈ IELTS 7.0+
    ielts_band = _estimate_ielts_band(fkg, fre)

    return ReadabilityScores(
        text=text,
        flesch_reading_ease=fre,
        flesch_kincaid_grade=fkg,
        gunning_fog=gf,
        smog_index=smog,
        coleman_liau_index=cli,
        automated_readability_index=ari,
        dale_chall_readability_score=dcrs,
        text_standard=ts,
        word_count=word_count,
        sentence_count=sentence_count,
        avg_sentence_length=avg_sent_len,
        syllable_count=syllable_count,
        ielts_band_estimate=ielts_band,
    )


def _estimate_ielts_band(fkg: float, fre: float) -> float:
    """Estimate IELTS reading band from readability scores.

    Rough mapping:
      FKG 1-4  → IELTS 3.0-4.0
      FKG 5-7  → IELTS 4.5-5.5
      FKG 8-10 → IELTS 6.0-6.5
      FKG 11-13 → IELTS 7.0-7.5
      FKG 14+  → IELTS 8.0-9.0
    """
    if fkg <= 4:
        return round(3.0 + (fkg / 4.0) * 1.0, 1)
    elif fkg <= 7:
        return round(4.5 + ((fkg - 4) / 3.0) * 1.0, 1)
    elif fkg <= 10:
        return round(6.0 + ((fkg - 7) / 3.0) * 0.5, 1)
    elif fkg <= 13:
        return round(7.0 + ((fkg - 10) / 3.0) * 0.5, 1)
    else:
        return min(9.0, round(8.0 + ((fkg - 13) / 5.0) * 1.0, 1))


def estimate_difficulty(text: str) -> dict:
    """Quick difficulty estimate returning just key metrics."""
    scores = analyze_readability(text)
    return {
        "difficulty_label": scores.difficulty_label,
        "difficulty_score": scores.difficulty_score,
        "ielts_band_estimate": scores.ielts_band_estimate,
        "flesch_kincaid_grade": scores.flesch_kincaid_grade,
        "word_count": scores.word_count,
    }
