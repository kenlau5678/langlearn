"""Kanji extraction and analysis utilities for Japanese text."""

from __future__ import annotations

from dataclasses import dataclass, field


# CJK Unicode ranges
_CJK_RANGES = [
    (0x4E00, 0x9FFF),    # CJK Unified Ideographs
    (0x3400, 0x4DBF),    # CJK Unified Ideographs Extension A
    (0x20000, 0x2A6DF),  # CJK Unified Ideographs Extension B
    (0xF900, 0xFAFF),    # CJK Compatibility Ideographs
]

# JLPT kanji by level (N5 ~103, N4 ~181 additional = ~284 total)
# This is a representative subset — full data loaded from JSON at runtime
_N5_KANJI = set(
    "一二三四五六七八九十百千万円時日月火水木金土年週毎前後午上下中外"
    "右左北南東西口目手足足体頭耳言語葉字声名前人男女子女父母兄弟姉妹"
    "友同先方大小学校高会社国何日本東京車駅道空港海天山川花草木花"
    "雨風雪部屋家戸窓卓椅子台所食飲肉魚野菜米茶酒料店"
    "買売読書聞見行来帰入出立待走走使持置送届届届届届"
    "開閉始終休働遊泳勉強教習問題答考言話知分思忘届届届"
    "好嫌上手下手中新古高安長短早強弱若明暗色白黒赤青"
    "病医院映音写新聞地図辞書傘靴帽子時計眼鏡財布鍵"
    "試質練問言葉意写真"
)


@dataclass
class KanjiInfo:
    """Information about a single kanji character."""

    character: str
    stroke_count: int | None = None
    grade: int | None = None  # school grade (1-6, 8=joyo)
    jlpt_level: str | None = None  # N5, N4, N3, etc.
    readings_on: list[str] = field(default_factory=list)
    readings_kun: list[str] = field(default_factory=list)
    meaning_zh: str | None = None
    meaning_en: str | None = None
    frequency: int | None = None  # usage frequency rank


def is_kanji(char: str) -> bool:
    """Check if a single character is a kanji."""
    cp = ord(char)
    for start, end in _CJK_RANGES:
        if start <= cp <= end:
            return True
    return False


def extract_kanji(text: str) -> list[str]:
    """Extract all unique kanji from text, preserving first-seen order."""
    seen: set[str] = set()
    result: list[str] = []
    for ch in text:
        if is_kanji(ch) and ch not in seen:
            seen.add(ch)
            result.append(ch)
    return result


def extract_kanji_with_positions(text: str) -> list[tuple[str, int]]:
    """Extract kanji with their character offsets in text."""
    return [(ch, i) for i, ch in enumerate(text) if is_kanji(ch)]


def count_kanji(text: str) -> int:
    """Count total kanji characters in text."""
    return sum(1 for ch in text if is_kanji(ch))


def kanji_density(text: str) -> float:
    """Calculate the proportion of kanji in text (0.0 to 1.0)."""
    if not text:
        return 0.0
    return count_kanji(text) / len(text)


def classify_kanji_level(kanji: str, n5_set: set[str] | None = None) -> str:
    """Classify a kanji into JLPT level based on known sets.

    Returns 'N5', 'N4', 'N3+', or 'unknown'.
    """
    ref = n5_set or _N5_KANJI
    if kanji in ref:
        return "N5"
    # Without the full N4 set loaded, return generic
    return "unknown"


def segment_by_kanji(text: str) -> list[dict]:
    """Segment text into kanji and non-kanji runs.

    Returns list of dicts: {"type": "kanji"|"text", "value": str, "start": int, "end": int}
    """
    segments: list[dict] = []
    if not text:
        return segments

    current_type = "kanji" if is_kanji(text[0]) else "text"
    start = 0
    buf = [text[0]]

    for i in range(1, len(text)):
        char_type = "kanji" if is_kanji(text[i]) else "text"
        if char_type == current_type:
            buf.append(text[i])
        else:
            segments.append({
                "type": current_type,
                "value": "".join(buf),
                "start": start,
                "end": i,
            })
            current_type = char_type
            start = i
            buf = [text[i]]

    segments.append({
        "type": current_type,
        "value": "".join(buf),
        "start": start,
        "end": len(text),
    })
    return segments
