"""SM-2 Spaced Repetition System algorithm implementation.

Based on the SuperMemo SM-2 algorithm (Anki variant).
Quality scale: 0-5
  5 - Perfect response
  4 - Correct with slight hesitation
  3 - Correct with serious difficulty
  2 - Incorrect but answer seemed easy to recall
  1 - Incorrect but upon seeing answer, remembered
  0 - Complete blackout
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from decimal import Decimal


@dataclass
class SM2Result:
    """Result of processing a single review."""

    quality: int  # 0-5
    ease_before: float
    ease_after: float
    interval_before: int
    interval_after: int
    repetitions: int
    lapses: int
    next_review: date
    was_correct: bool
    mastery_level: str  # new, learning, young, mature, relearning


def sm2_process(
    quality: int,
    ease_factor: float = 2.50,
    interval_days: int = 0,
    repetitions: int = 0,
    lapses: int = 0,
    today: date | None = None,
) -> SM2Result:
    """Process a single review using SM-2 algorithm.

    Args:
        quality: 0-5 rating of how well the user remembered.
        ease_factor: Current ease factor (minimum 1.30).
        interval_days: Current interval in days.
        repetitions: Number of consecutive correct reviews.
        lapses: Number of times the card was forgotten.
        today: Current date (defaults to today).

    Returns:
        SM2Result with updated scheduling parameters.
    """
    if today is None:
        today = date.today()

    ease_before = ease_factor
    interval_before = interval_days
    was_correct = quality >= 3

    if quality < 3:
        # Failed review — reset to learning
        lapses += 1
        repetitions = 0
        interval_days = 1  # Review again tomorrow
        mastery_level = "relearning" if interval_before > 0 else "learning"
    else:
        # Successful review
        if repetitions == 0:
            # First correct review
            interval_days = 1
        elif repetitions == 1:
            # Second correct review
            interval_days = 6
        else:
            # Subsequent reviews: interval * ease_factor
            interval_days = max(1, round(interval_days * ease_factor))

        repetitions += 1

        # Determine mastery level
        if interval_days < 21:
            mastery_level = "young"
        else:
            mastery_level = "mature"

    # Update ease factor (SM-2 formula)
    # EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
    q = quality
    ease_delta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)
    ease_factor = max(1.30, ease_factor + ease_delta)

    next_review = today + timedelta(days=interval_days)

    return SM2Result(
        quality=quality,
        ease_before=ease_before,
        ease_after=ease_factor,
        interval_before=interval_before,
        interval_after=interval_days,
        repetitions=repetitions,
        lapses=lapses,
        next_review=next_review,
        was_correct=was_correct,
        mastery_level=mastery_level,
    )


def get_card_priority(
    next_review_date: date,
    ease_factor: float,
    repetitions: int,
    lapses: int,
    today: date | None = None,
) -> int:
    """Calculate review priority for sorting due cards.

    Higher number = higher priority (review sooner).
    Based on overdue days, ease factor, and lapse count.
    """
    if today is None:
        today = date.today()

    overdue_days = (today - next_review_date).days
    if overdue_days < 0:
        return 0  # Not yet due

    # Priority factors:
    # 1. Overdue days (more overdue = higher priority)
    # 2. Low ease factor (harder cards = higher priority)
    # 3. High lapse count (leeches = higher priority)
    # 4. Low repetitions (new cards = moderate priority)

    priority = overdue_days * 10
    priority += max(0, int((3.0 - ease_factor) * 20))
    priority += min(lapses, 10) * 5
    if repetitions == 0:
        priority += 15  # New cards get a boost

    return priority
