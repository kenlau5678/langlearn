"""NLP modules for Japanese and English processing."""

# Japanese NLP (optional — requires sudachipy, jaconv, etc.)
try:
    from app.nlp.tokenizer import (
        JapaneseTokenizer,
        TokenizerResult,
        Token,
        get_tokenizer,
        normalize_text,
        to_hiragana,
        to_katakana,
        to_romaji,
    )
    from app.nlp.furigana import (
        FuriganaSegment,
        FuriganaResult,
        generate_furigana,
        generate_furigana_batch,
        get_reading,
        to_furigana_html,
    )
    from app.nlp.kanji import (
        KanjiInfo,
        is_kanji,
        extract_kanji,
        extract_kanji_with_positions,
        count_kanji,
        kanji_density,
        classify_kanji_level,
        segment_by_kanji,
    )
    _JA_AVAILABLE = True
except ImportError:
    _JA_AVAILABLE = False

# English NLP (optional — requires spaCy, g2p_en, textstat)
try:
    from app.nlp.en_tokenizer import (
        EnglishTokenizer,
        EnToken,
        EnTokenizerResult,
        get_en_tokenizer,
    )
    from app.nlp.en_phonetics import (
        EnglishPhonetics,
        PhonemeResult,
        SentencePhonetics,
        get_phonetics,
        get_ipa,
        get_sentence_ipa,
    )
    from app.nlp.en_readability import (
        ReadabilityScores,
        analyze_readability,
        estimate_difficulty,
    )
    _EN_AVAILABLE = True
except ImportError:
    _EN_AVAILABLE = False
