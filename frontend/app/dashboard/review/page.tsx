"use client";

import { progressAPI, ReviewCard } from "@/lib/api";
import { useState, useEffect, useCallback, useMemo } from "react";
import { IELTS_VOCAB, IeltsWord } from "@/lib/ielts-vocab";
import { CheckCircle2, XCircle, Loader2, RotateCcw, ChevronRight } from "lucide-react";

// ── SRS review types ──────────────────────────────────────────────────────
interface SessionStats { correct: number; wrong: number; total: number }

const FORGOTTEN_VOCAB_KEY = "langlearn:forgotten-vocab";
const PLACEHOLDER_MEANING_PREFIX = "待补充释义：";
const GENERIC_CORPUS_MEANING = "IELTS reading vocabulary from the built-in article corpus";
const CEFR_LEVELS = ["B2", "C1", "C2"] as const;
const IELTS_TOPICS = Array.from(new Set(IELTS_VOCAB.map((word) => word.topic))).sort();

function displayMeaningZh(word: string, meaning?: string | null) {
  if (!meaning || meaning.startsWith(PLACEHOLDER_MEANING_PREFIX)) {
    return `释义待完善：${word}`;
  }
  return meaning;
}

function displayMeaningEn(meaning?: string | null) {
  if (!meaning || meaning === GENERIC_CORPUS_MEANING) {
    return "这是一篇 IELTS 阅读语料中出现的词，可在文章助手中查询语境用法。";
  }
  return meaning;
}

function shuffleWords(words: IeltsWord[]) {
  const shuffled = [...words];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ── Main component ────────────────────────────────────────────────────────
export default function ReviewPage() {
  const [srsCards, setSrsCards] = useState<ReviewCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"idle" | "srs" | "vocab" | "missed">("idle");

  // vocab browse state
  const [vocabIdx, setVocabIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [studyDeck, setStudyDeck] = useState<IeltsWord[]>([]);
  const [cefrFilter, setCefrFilter] = useState<"all" | IeltsWord["cefr"]>("all");
  const [topicFilter, setTopicFilter] = useState("all");

  // srs state
  const [srsIdx, setSrsIdx] = useState(0);
  const [srsFlipped, setSrsFlipped] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState<SessionStats>({ correct: 0, wrong: 0, total: 0 });
  const [srsDone, setSrsDone] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [forgottenWords, setForgottenWords] = useState<string[]>([]);

  const fetchSrs = useCallback(async () => {
    setLoading(true);
    try {
      const r = await progressAPI.getDueReviews("en");
      const d = r as { data: ReviewCard[] };
      setSrsCards(d.data || []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSrs(); }, [fetchSrs]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FORGOTTEN_VOCAB_KEY) || "[]");
      if (Array.isArray(saved)) setForgottenWords(saved.filter((w) => typeof w === "string"));
    } catch {
      setForgottenWords([]);
    }
  }, []);

  // ── All vocab (no filters) ──
  const forgottenSet = useMemo(() => new Set(forgottenWords), [forgottenWords]);
  const forgottenVocab = useMemo(
    () => IELTS_VOCAB.filter((word) => forgottenSet.has(word.word)),
    [forgottenSet]
  );
  const selectedVocab = useMemo(
    () => IELTS_VOCAB.filter((word) =>
      (cefrFilter === "all" || word.cefr === cefrFilter)
      && (topicFilter === "all" || word.topic === topicFilter)
    ),
    [cefrFilter, topicFilter]
  );
  const filteredVocab = studyDeck;

  const saveForgottenWords = useCallback((words: string[]) => {
    const next = Array.from(new Set(words));
    setForgottenWords(next);
    localStorage.setItem(FORGOTTEN_VOCAB_KEY, JSON.stringify(next));
  }, []);

  const leaveVocabMode = () => {
    setMode("idle");
    setVocabIdx(0);
    setFlipped(false);
    setStudyDeck([]);
  };

  const startVocabMode = (nextMode: "vocab" | "missed") => {
    const words = nextMode === "missed" ? forgottenVocab : selectedVocab;
    setStudyDeck(shuffleWords(words));
    setVocabIdx(0);
    setFlipped(false);
    setMode(nextMode);
  };

  const advanceVocab = (total: number) => {
    setFlipped(false);
    if (vocabIdx + 1 < total) setVocabIdx((i) => i + 1);
    else leaveVocabMode();
  };

  const markForgotten = (word: IeltsWord, total: number) => {
    saveForgottenWords([...forgottenWords, word.word]);
    advanceVocab(total);
  };

  const markRemembered = (word: IeltsWord, total: number) => {
    const nextForgotten = forgottenWords.filter((w) => w !== word.word);
    saveForgottenWords(nextForgotten);
    setFlipped(false);

    if (mode !== "missed") {
      advanceVocab(total);
      return;
    }

    const nextDeck = studyDeck.filter((item) => item.word !== word.word);
    if (nextDeck.length === 0) {
      leaveVocabMode();
      return;
    }

    setStudyDeck(nextDeck);
    setVocabIdx((index) => Math.min(index, nextDeck.length - 1));
  };

  // ── SRS handlers ──
  const currentSrs = srsCards[srsIdx];

  useEffect(() => {
    if (srsCards.length > 0 && !srsFlipped) setStartTime(Date.now());
  }, [srsIdx, srsFlipped, srsCards.length]);

  const handleRate = async (quality: number) => {
    if (!currentSrs || submitting) return;
    setSubmitting(true);
    try {
      await progressAPI.submitReview({
        knowledge_point_id: currentSrs.knowledge_point_id,
        quality,
        response_ms: Date.now() - startTime,
      });
      setStats((p) => ({
        correct: p.correct + (quality >= 3 ? 1 : 0),
        wrong: p.wrong + (quality < 3 ? 1 : 0),
        total: p.total + 1,
      }));
      setTimeout(() => {
        if (srsIdx + 1 >= srsCards.length) setSrsDone(true);
        else { setSrsIdx((i) => i + 1); setSrsFlipped(false); }
        setSubmitting(false);
      }, 250);
    } catch { setSubmitting(false); }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
        <Loader2 size={22} className="animate-spin" style={{ color: "#9ca3af" }} />
      </div>
    );
  }

  // ── SRS review mode ──
  if (mode === "srs") {
    if (srsDone) {
      const acc = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      return (
        <div style={{ textAlign: "center", paddingTop: 48 }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>
            {acc >= 80 ? "🌟" : acc >= 60 ? "👍" : "💪"}
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 4 }}>复习完成！</h2>
          <p style={{ fontSize: "0.875rem", color: "#9ca3af", marginBottom: 32 }}>
            共复习 {stats.total} 个单词
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 32 }}>
            {[
              { label: "记住了", value: stats.correct, color: "#16a34a" },
              { label: "没记住", value: stats.wrong, color: "#ef4444" },
              { label: "正确率", value: `${acc}%`, color: "#111" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: "12px 20px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "1.375rem", fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setMode("idle"); setSrsIdx(0); setSrsFlipped(false); setSrsDone(false); setStats({ correct: 0, wrong: 0, total: 0 }); fetchSrs(); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 24px", borderRadius: 12,
              background: "#16a34a", color: "#fff", fontWeight: 600,
              border: "none", cursor: "pointer", fontSize: "0.9375rem",
            }}
          >
            <RotateCcw size={15} /> 返回
          </button>
        </div>
      );
    }

    const progress = Math.round((srsIdx / srsCards.length) * 100);

    return (
      <div>
        <button onClick={() => setMode("idle")} style={backBtnStyle}>← 返回</button>

        {/* Progress bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", color: "#9ca3af", marginBottom: 6 }}>
            <span>{srsIdx + 1} / {srsCards.length}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "#16a34a" }}>✓ {stats.correct}</span>
              <span style={{ color: "#ef4444" }}>✗ {stats.wrong}</span>
            </span>
          </div>
          <div style={{ height: 4, background: "#f3f4f6", borderRadius: 4 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "#16a34a", borderRadius: 4, transition: "width 0.3s" }} />
          </div>
        </div>

        <FlashCard
          word={currentSrs.surface_form}
          pronunciation={currentSrs.pronunciation}
          pos={currentSrs.pos}
          meaning_zh={currentSrs.meaning_zh}
          meaning_en={currentSrs.meaning_en}
          example={currentSrs.example_target?.[0]}
          example_zh={currentSrs.example_zh?.[0]}
          band={currentSrs.proficiency_level}
          flipped={srsFlipped}
          onFlip={() => setSrsFlipped(true)}
        />

        {srsFlipped && (
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "#9ca3af" }}>你记住了吗？</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <RateBtn emoji="😕" label="没记住" sub="明天再来" color="#ef4444" bg="#fef2f2" border="#fee2e2" onClick={() => handleRate(1)} disabled={submitting} />
              <RateBtn emoji="😊" label="记住了" sub={`${Math.max(1, Math.round(currentSrs.interval_days * currentSrs.ease_factor))} 天后复习`} color="#16a34a" bg="#f0fdf4" border="#bbf7d0" onClick={() => handleRate(5)} disabled={submitting} />
            </div>
            <button onClick={() => handleRate(3)} disabled={submitting} style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", color: "#6b7280", fontSize: "0.875rem", cursor: "pointer" }}>
              有点模糊，再加强
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Vocab study mode ──
  if (mode === "vocab" || mode === "missed") {
    if (filteredVocab.length === 0) {
      return (
        <div>
          <button onClick={leaveVocabMode} style={backBtnStyle}>← 返回</button>
          <p style={{ color: "#9ca3af", marginTop: 24 }}>
            {mode === "missed" ? "暂时没有需要复习的词。" : "该筛选条件下没有词汇。"}
          </p>
        </div>
      );
    }

    const word = filteredVocab[vocabIdx];
    const total = filteredVocab.length;

    return (
      <div>
        <button onClick={leaveVocabMode} style={backBtnStyle}>← 返回</button>

        {/* Progress */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", color: "#9ca3af", marginBottom: 6 }}>
          <span>{mode === "missed" ? "复习" : "学习"} · {vocabIdx + 1} / {total}</span>
          <span style={{ background: "#f0fdf4", color: "#16a34a", padding: "2px 8px", borderRadius: 999, fontWeight: 600, fontSize: "0.75rem" }}>
            {word.topic}
          </span>
        </div>
        <div style={{ height: 4, background: "#f3f4f6", borderRadius: 4, marginBottom: 20 }}>
          <div style={{ height: "100%", width: `${Math.round((vocabIdx / total) * 100)}%`, background: "#16a34a", borderRadius: 4, transition: "width 0.3s" }} />
        </div>

        <FlashCard
          word={word.word}
          pronunciation={word.pronunciation}
          pos={word.pos}
          meaning_zh={word.meaning_zh}
          meaning_en={word.meaning_en}
          example={word.example}
          example_zh={word.example_zh}
          band={word.band}
          cefr={word.cefr}
          frequencyBand={word.frequency_band}
          topic={word.topic}
          flipped={flipped}
          onFlip={() => setFlipped(true)}
        />

        {flipped && (
          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button
              onClick={() => markForgotten(word, total)}
              style={{ padding: "12px 0", borderRadius: 12, border: "1px solid #fecaca", background: "#fff", color: "#dc2626", fontWeight: 700, fontSize: "0.9375rem", cursor: "pointer" }}
            >
              不记得
            </button>
            <button
              onClick={() => markRemembered(word, total)}
              style={{ padding: "12px 0", borderRadius: 12, border: "none", background: "#16a34a", color: "#fff", fontWeight: 600, fontSize: "0.9375rem", cursor: "pointer" }}
            >
              记得
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Home / idle ──
  return (
    <div style={{ paddingTop: 8 }}>
      <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: "#111", marginBottom: 4 }}>背单词</h1>
      <p style={{ fontSize: "0.875rem", color: "#9ca3af", marginBottom: 24 }}>
        IELTS 学术词汇 · CEFR B2-C2 · 共 {IELTS_VOCAB.length} 词
      </p>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }} aria-label="CEFR 难度">
          <FilterPill active={cefrFilter === "all"} onClick={() => setCefrFilter("all")}>全部</FilterPill>
          {CEFR_LEVELS.map((level) => (
            <FilterPill key={level} active={cefrFilter === level} onClick={() => setCefrFilter(level)}>
              {level}
            </FilterPill>
          ))}
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.8125rem", color: "#6b7280" }}>
          <span>IELTS 主题</span>
          <select
            value={topicFilter}
            onChange={(event) => setTopicFilter(event.target.value)}
            style={{ minWidth: 150, padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", color: "#374151", fontSize: "0.8125rem" }}
          >
            <option value="all">全部主题</option>
            {IELTS_TOPICS.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
          </select>
          <span>{selectedVocab.length} 词</span>
        </label>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* SRS review — shown if due cards exist */}
        {srsCards.length > 0 && (
          <button
            onClick={() => setMode("srs")}
            style={{
              width: "100%", padding: "20px 20px", borderRadius: 14,
              border: "2px solid #16a34a", background: "#f0fdf4",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer", textAlign: "left",
            }}
          >
            <div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#16a34a" }}>
                今日待复习 · {srsCards.length} 词
              </div>
              <div style={{ fontSize: "0.8125rem", color: "#6b7280", marginTop: 2 }}>
                现在复习效果最好
              </div>
            </div>
            <ChevronRight size={18} color="#16a34a" />
          </button>
        )}

        {forgottenWords.length > 0 && (
          <button
            onClick={() => startVocabMode("missed")}
            style={{
              width: "100%", padding: "20px 20px", borderRadius: 14,
              border: "1px solid #bbf7d0", background: "#f0fdf4",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer", textAlign: "left",
            }}
          >
            <div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#16a34a" }}>
                复习不记得的词 · {forgottenWords.length} 词
              </div>
              <div style={{ fontSize: "0.8125rem", color: "#6b7280", marginTop: 2 }}>
                先把薄弱词过一遍
              </div>
            </div>
            <ChevronRight size={18} color="#16a34a" />
          </button>
        )}

        {/* Start learning */}
        <button
          onClick={() => startVocabMode("vocab")}
          disabled={selectedVocab.length === 0}
          style={{
            width: "100%", padding: "20px 20px", borderRadius: 14,
            border: "1px solid #e5e7eb", background: "#fff",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: selectedVocab.length ? "pointer" : "default", textAlign: "left",
            opacity: selectedVocab.length ? 1 : 0.55,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#16a34a"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb"; }}
        >
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "#111" }}>开始学习</div>
            <div style={{ fontSize: "0.8125rem", color: "#9ca3af", marginTop: 2 }}>
              随机学习 · 当前 {selectedVocab.length} 词
            </div>
          </div>
          <ChevronRight size={18} color="#9ca3af" />
        </button>
      </div>
    </div>
  );
}

// ── FlashCard ─────────────────────────────────────────────────────────────
function FlashCard({
  word, pronunciation, pos, meaning_zh, meaning_en,
  example, example_zh, band, cefr, frequencyBand, topic, flipped, onFlip,
}: {
  word: string; pronunciation?: string | null; pos?: string | null;
  meaning_zh?: string | null; meaning_en?: string | null;
  example?: string | null; example_zh?: string | null;
  band?: string | null; cefr?: string | null; frequencyBand?: string | null;
  topic?: string | null; flipped: boolean; onFlip: () => void;
}) {
  const shownMeaningZh = displayMeaningZh(word, meaning_zh);
  const shownMeaningEn = displayMeaningEn(meaning_en);

  return (
    <div
      onClick={() => !flipped && onFlip()}
      style={{
        borderRadius: 16,
        border: `2px solid ${flipped ? "#16a34a" : "#e5e7eb"}`,
        background: flipped ? "#f0fdf4" : "#fff",
        overflow: "hidden",
        cursor: flipped ? "default" : "pointer",
        transition: "border-color 0.15s, background 0.15s",
      }}
    >
      {/* Front */}
      <div style={{ padding: "36px 24px", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", fontWeight: 700, color: "#111", marginBottom: 8 }}>{word}</div>
        {pronunciation && (
          <div style={{ fontSize: "0.9375rem", color: "#9ca3af", marginBottom: 4 }}>/{pronunciation}/</div>
        )}
        {pos && (
          <div style={{ fontSize: "0.8125rem", color: "#9ca3af", fontStyle: "italic", marginBottom: 8 }}>{pos}</div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6 }}>
          {cefr && <span style={levelBadgeStyle}>CEFR {cefr}</span>}
          {band && <span style={levelBadgeStyle}>Band {band}</span>}
          {frequencyBand && <span style={levelBadgeStyle}>{frequencyBand}</span>}
        </div>
      </div>

      <div style={{ borderTop: "1px solid #e5e7eb" }} />

      {/* Back */}
      {flipped ? (
        <div style={{ padding: "20px 24px" }}>
          {topic && <div style={{ textAlign: "center", fontSize: "0.75rem", color: "#16a34a", marginBottom: 10 }}>{topic}</div>}
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{ fontSize: "1.375rem", fontWeight: 700, color: "#111", marginBottom: 4 }}>{shownMeaningZh}</div>
            {shownMeaningEn && (
              <div style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.5 }}>{shownMeaningEn}</div>
            )}
          </div>
          {example && (
            <div style={{
              background: "#fff", borderRadius: 10, padding: "12px 14px",
              border: "1px solid #e5e7eb",
            }}>
              <p style={{ fontSize: "0.9rem", color: "#374151", lineHeight: 1.6, margin: 0 }}>{example}</p>
              {example_zh && (
                <p style={{ fontSize: "0.8125rem", color: "#9ca3af", marginTop: 6, lineHeight: 1.5 }}>{example_zh}</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: "16px 24px", textAlign: "center", fontSize: "0.875rem", color: "#9ca3af" }}>
          点击翻牌查看释义
        </div>
      )}
    </div>
  );
}

// ── Rating button ─────────────────────────────────────────────────────────
function RateBtn({ emoji, label, sub, color, bg, border, onClick, disabled }: {
  emoji: string; label: string; sub: string;
  color: string; bg: string; border: string;
  onClick: () => void; disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "16px 0", borderRadius: 12, border: `2px solid ${border}`,
        background: bg, color, fontWeight: 600, fontSize: "0.9375rem",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.6 : 1,
        transition: "opacity 0.15s",
      }}
    >
      <span style={{ fontSize: "1.5rem" }}>{emoji}</span>
      {label}
      <span style={{ fontSize: "0.75rem", fontWeight: 400, opacity: 0.7 }}>{sub}</span>
    </button>
  );
}

// ── Filter pill ───────────────────────────────────────────────────────────
function FilterPill({ children, active, onClick }: {
  children: React.ReactNode; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 14px", borderRadius: 999, fontSize: "0.8125rem",
        fontWeight: 500, border: `1px solid ${active ? "#16a34a" : "#e5e7eb"}`,
        background: active ? "#16a34a" : "#fff",
        color: active ? "#fff" : "#6b7280",
        cursor: "pointer", transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────
const backBtnStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 4,
  fontSize: "0.875rem", color: "#6b7280",
  background: "none", border: "none", cursor: "pointer",
  padding: 0, marginBottom: 24,
};

const levelBadgeStyle: React.CSSProperties = {
  fontSize: "0.75rem", fontWeight: 600, color: "#16a34a",
  background: "#dcfce7", padding: "3px 10px", borderRadius: 999,
};
