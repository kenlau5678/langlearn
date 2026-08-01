"""English phonetics module using g2p_en for IPA transcription."""

from __future__ import annotations

from dataclasses import dataclass

from g2p_en import G2p


@dataclass
class PhonemeResult:
    """Phonetic transcription result for a word."""

    word: str
    ipa: str  # IPA transcription
    arpabet: list[str]  # ARPAbet phoneme list


@dataclass
class SentencePhonetics:
    """Phonetic transcription for a full sentence."""

    text: str
    words: list[PhonemeResult]

    def to_ipa_string(self) -> str:
        """Return full IPA transcription with word boundaries."""
        return " ".join(w.ipa for w in self.words if w.ipa)


class EnglishPhonetics:
    """IPA phonetic transcription using g2p_en (grapheme-to-phoneme)."""

    # ARPAbet to IPA mapping (subset of most common phonemes)
    _ARPABET_TO_IPA = {
        "AA": "ɑː", "AE": "æ", "AH": "ʌ", "AO": "ɔː", "AW": "aʊ",
        "AY": "aɪ", "B": "b", "CH": "tʃ", "D": "d", "DH": "ð",
        "EH": "ɛ", "ER": "ɜːr", "EY": "eɪ", "F": "f", "G": "ɡ",
        "HH": "h", "IH": "ɪ", "IY": "iː", "JH": "dʒ", "K": "k",
        "L": "l", "M": "m", "N": "n", "NG": "ŋ", "OW": "oʊ",
        "OY": "ɔɪ", "P": "p", "R": "r", "S": "s", "SH": "ʃ",
        "T": "t", "TH": "θ", "UH": "ʊ", "UW": "uː", "V": "v",
        "W": "w", "Y": "j", "Z": "z", "ZH": "ʒ",
    }

    def __init__(self):
        self._g2p = G2p()

    def transcribe_word(self, word: str) -> PhonemeResult:
        """Get IPA transcription for a single word."""
        arpabet = self._g2p(word)
        ipa = self._arpabet_to_ipa(arpabet)
        return PhonemeResult(word=word, ipa=ipa, arpabet=arpabet)

    def transcribe_sentence(self, text: str) -> SentencePhonetics:
        """Transcribe a full sentence word-by-word."""
        import re
        words_raw = re.findall(r"\b[\w']+\b", text)
        results: list[PhonemeResult] = []
        for word in words_raw:
            try:
                results.append(self.transcribe_word(word))
            except Exception:
                results.append(PhonemeResult(word=word, ipa=word, arpabet=[]))
        return SentencePhonetics(text=text, words=results)

    def _arpabet_to_ipa(self, arpabet: list[str]) -> str:
        """Convert ARPAbet phoneme list to IPA string."""
        ipa_parts: list[str] = []
        for phoneme in arpabet:
            # Strip stress markers (0, 1, 2)
            base = phoneme.rstrip("012")
            ipa_char = self._ARPABET_TO_IPA.get(base, base.lower())
            ipa_parts.append(ipa_char)
        return "".join(ipa_parts)


# Singleton instance
_phonetics_instance: EnglishPhonetics | None = None


def get_phonetics() -> EnglishPhonetics:
    """Get or create the singleton phonetics instance."""
    global _phonetics_instance
    if _phonetics_instance is None:
        _phonetics_instance = EnglishPhonetics()
    return _phonetics_instance


def get_ipa(word: str) -> str:
    """Convenience: get IPA transcription for a single word."""
    return get_phonetics().transcribe_word(word).ipa


def get_sentence_ipa(text: str) -> str:
    """Convenience: get IPA transcription for a sentence."""
    return get_phonetics().transcribe_sentence(text).to_ipa_string()
