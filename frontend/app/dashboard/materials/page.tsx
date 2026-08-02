"use client";

import { materialsAPI, streamRequest } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";
import AskPanelOverlay from "@/components/AskPanelOverlay";
import ReactMarkdown from "react-markdown";
import { IELTS_PASSAGES, IeltsPassage } from "@/lib/ielts-passages";
import { ArrowLeft, Loader2, Sparkles, Trash2 } from "lucide-react";

interface Material {
  id: string;
  title: string;
  content_text: string;
  target_language: string;
  proficiency_level: string;
  created_at: string;
  source_type?: string;
}

interface AskState {
  isOpen: boolean;
  selectedText: string;
  fullSentence?: string;
  type?: "word" | "text";
}

type Screen = "home" | "library" | "ai" | "saved";

const BANDS = ["6.0", "6.5", "7.0", "7.5", "8.0", "8.5", "9.0"];

function getGeneratedTitle(content: string, level: string) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return heading || `AI · Band ${level} · ${new Date().toLocaleDateString("zh-CN")}`;
}

// ── Clickable highlighted vocab ──
function Vocab({
  children,
  onWordClick,
}: {
  children: string;
  onWordClick: (word: string, sentence: string) => void;
}) {
  return (
    <mark
      style={{
        background: "none",
        color: "inherit",
        borderBottom: "2px dashed #16a34a",
        cursor: "pointer",
        fontWeight: 600,
        padding: 0,
      }}
      onClick={(e) => {
        e.stopPropagation();
        const text = e.currentTarget.textContent || "";
        const sentence = e.currentTarget.closest("p")?.textContent || text;
        onWordClick(text, sentence);
      }}
      title="Click to explain"
    >
      {children}
    </mark>
  );
}

// ── Article body with editorial typography ──
function ArticleBody({
  content,
  onWordClick,
  onTextSelect,
}: {
  content: string;
  onWordClick: (word: string, sentence: string) => void;
  onTextSelect: (text: string, sentence: string) => void;
}) {
  const handleMouseUp = () => {
    const sel = window.getSelection()?.toString().trim();
    if (!sel || sel.length < 2 || sel.length > 300) return;
    onTextSelect(sel, sel);
  };

  return (
    <div
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
      style={{
        userSelect: "text",
        cursor: "text",
        maxWidth: 680,
        margin: "0 auto",
        textAlign: "left",
      }}
    >
      <ReactMarkdown
        components={{
          strong: ({ children }) => (
            <Vocab onWordClick={onWordClick}>{String(children)}</Vocab>
          ),
          h1: ({ children }) => (
            <h1
              style={{
                fontSize: "1.625rem",
                fontWeight: 700,
                lineHeight: 1.3,
                marginBottom: "0.75rem",
                color: "#111",
                letterSpacing: 0,
                textAlign: "center",
              }}
            >
              {children}
            </h1>
          ),
          p: ({ children }) => (
            <p
              style={{
                fontSize: "1.0625rem",
                lineHeight: 1.85,
                marginBottom: "1.4em",
                color: "#1a1a1a",
                textAlign: "left",
              }}
            >
              {children}
            </p>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function MaterialsPage() {
  const [screen, setScreen] = useState<Screen>("home");
  const [bandFilter, setBandFilter] = useState<string | null>(null);
  const [selectedPassage, setSelectedPassage] = useState<IeltsPassage | Material | null>(null);
  const [savedMaterials, setSavedMaterials] = useState<Material[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genContent, setGenContent] = useState("");
  const [genLevel, setGenLevel] = useState("7.0");
  const [askState, setAskState] = useState<AskState>({ isOpen: false, selectedText: "" });
  const [askPanelOpen, setAskPanelOpen] = useState(false);
  const [savingGenerated, setSavingGenerated] = useState(false);
  const [genSaveMessage, setGenSaveMessage] = useState("");
  const [savingReading, setSavingReading] = useState(false);
  const [readingSaveMessage, setReadingSaveMessage] = useState("");
  const [askDraftKey, setAskDraftKey] = useState(0);

  useEffect(() => {
    setAskPanelOpen(false);
    setReadingSaveMessage("");
  }, [selectedPassage]);

  const fetchSaved = useCallback(async () => {
    setLoadingSaved(true);
    try {
      const r = await materialsAPI.list({ target_language: "en", page: 1, page_size: 50 });
      setSavedMaterials((r as { data: Material[] }).data || []);
    } catch { /* silent */ }
    finally { setLoadingSaved(false); }
  }, []);

  const handleWordClick = (word: string, sentence: string) => {
    setAskState({ isOpen: true, selectedText: word, fullSentence: sentence, type: "word" });
    setAskPanelOpen(true);
    setAskDraftKey(Date.now());
  };

  const handleTextSelect = (text: string, sentence: string) => {
    setAskState({ isOpen: true, selectedText: text, fullSentence: sentence, type: "text" });
    setAskPanelOpen(true);
    setAskDraftKey(Date.now());
  };

  const askDraftQuestion = askState.selectedText
    ? askState.type === "word"
      ? `请解释「${askState.selectedText}」在这句话里的意思、用法和语法作用：${askState.fullSentence || askState.selectedText}`
      : `请解释这段文字的意思、语法结构和重点表达：${askState.selectedText}`
    : "";

  const generateAI = async () => {
    setGenerating(true);
    setGenContent("");
    setGenSaveMessage("");
    try {
      await streamRequest(
        "/generate/lesson",
        { target_language: "en", lesson_type: "reading", proficiency_level: genLevel, level_system: "ielts" },
        {
          onToken: (t) => setGenContent((p) => p + t),
          onDone: () => setGenerating(false),
          onError: (msg) => { setGenContent(`Error: ${msg}`); setGenerating(false); },
        }
      );
    } catch {
      setGenContent("生成失败，请检查 API Key。");
      setGenerating(false);
    }
  };

  const saveGenerated = async () => {
    const content = genContent.trim();
    if (!content || savingGenerated) return;

    setSavingGenerated(true);
    setGenSaveMessage("");
    try {
      await materialsAPI.create({
        title: getGeneratedTitle(content, genLevel),
        content_text: content,
        target_language: "en",
        source_type: "ai_generated",
        proficiency_level: genLevel,
        level_system: "ielts",
      });
      setGenSaveMessage("已保存到文库");
      fetchSaved();
    } catch {
      setGenSaveMessage("保存失败，请先确认已登录，后端数据库正常。");
    } finally {
      setSavingGenerated(false);
    }
  };

  const saveCurrentPassage = async () => {
    if (!selectedPassage || savingReading) return;
    if (!("band" in selectedPassage)) {
      setReadingSaveMessage("这篇已经在文库里。");
      return;
    }

    setSavingReading(true);
    setReadingSaveMessage("");
    try {
      await materialsAPI.create({
        title: selectedPassage.title,
        content_text: selectedPassage.content,
        target_language: "en",
        source_type: "ielts_reference",
        proficiency_level: selectedPassage.band,
        level_system: "ielts",
      });
      setReadingSaveMessage("已保存到文库");
      fetchSaved();
    } catch {
      setReadingSaveMessage("保存失败，请先确认已登录，后端数据库正常。");
    } finally {
      setSavingReading(false);
    }
  };

  const deleteSaved = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await materialsAPI.delete(id);
    if ((selectedPassage as Material)?.id === id) setSelectedPassage(null);
    fetchSaved();
  };

  // ── Reading view ──
  if (selectedPassage) {
    const isIelts = "band" in selectedPassage;
    const band = isIelts ? selectedPassage.band : (selectedPassage as Material).proficiency_level;
    const content = isIelts ? selectedPassage.content : (selectedPassage as Material).content_text;
    const source = isIelts ? (selectedPassage as IeltsPassage).source : null;

    return (
      <div className={`reading-page ${askPanelOpen ? "reading-page-with-ai" : ""}`}>
        {/* Minimal back bar */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div
            className="reading-topbar-inner"
            style={{
              height: 62,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={() => setSelectedPassage(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.875rem",
                color: "#6b7280",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              <ArrowLeft size={14} />
              返回
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {isIelts && (
                <button
                  onClick={saveCurrentPassage}
                  disabled={savingReading}
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: savingReading ? "#86efac" : "#16a34a",
                    background: "none",
                    border: "none",
                    cursor: savingReading ? "default" : "pointer",
                    padding: 0,
                  }}
                >
                  {savingReading ? "保存中..." : "保存到文库"}
                </button>
              )}
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#16a34a",
                  background: "#f0fdf4",
                  padding: "3px 10px",
                  borderRadius: 999,
                }}
              >
                Band {band}
              </span>
            </div>
          </div>
        </div>

        {/* Article */}
        <div
          className="reading-article-wrap"
          style={{
            paddingTop: 56,
            paddingBottom: 80,
          }}
        >
          <ArticleBody
            content={content}
            onWordClick={handleWordClick}
            onTextSelect={handleTextSelect}
          />

          {/* Footer */}
          <div
            style={{
              marginTop: 56,
              paddingTop: 24,
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: "0.75rem", color: "#9ca3af", textAlign: "center" }}>
              Click a{" "}
              <span style={{ borderBottom: "2px dashed #16a34a" }}>underlined word</span>{" "}
              to explain it, or select any text.
            </p>
            {source && (
              <p style={{ fontSize: "0.7rem", color: "#d1d5db", textAlign: "center" }}>
                Source: {source}
              </p>
            )}
            {readingSaveMessage && (
              <p style={{ fontSize: "0.75rem", color: readingSaveMessage.startsWith("已") ? "#16a34a" : "#ef4444", textAlign: "center" }}>
                {readingSaveMessage}
              </p>
            )}
          </div>
        </div>

        {/* Ask AI floating panel */}
        <AskPanelOverlay
          articleTitle={isIelts ? selectedPassage.title : (selectedPassage as Material).title}
          articleContent={content}
          open={askPanelOpen}
          onOpenChange={setAskPanelOpen}
          draftQuestion={askDraftQuestion}
          draftQuestionKey={askDraftKey}
        />
      </div>
    );
  }

  // ── Home screen ──
  if (screen === "home") {
    return (
      <div style={{ paddingTop: 24 }}>
        <h1 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: 4, color: "#111" }}>
          阅读
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: 40 }}>
          选择一篇文章开始阅读，点击绿色词汇查看解释
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <HomeButton
            label="IELTS 范文库"
            sub={`${IELTS_PASSAGES.length} 篇 · Band 6.0 - 9.0`}
            onClick={() => setScreen("library")}
          />
          <HomeButton
            label="AI 生成文章"
            sub="根据难度实时生成"
            onClick={() => setScreen("ai")}
          />
          <HomeButton
            label="已保存"
            sub="我保存的 AI 文章"
            onClick={() => { fetchSaved(); setScreen("saved"); }}
          />
        </div>
      </div>
    );
  }

  // ── Library screen ──
  if (screen === "library") {
    const filtered = bandFilter
      ? IELTS_PASSAGES.filter((p) => p.band === bandFilter)
      : IELTS_PASSAGES;

    return (
      <div>
        <ScreenHeader title="IELTS 范文库" onBack={() => setScreen("home")} />

        {/* Band pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          <FilterPill active={bandFilter === null} onClick={() => setBandFilter(null)}>
            全部
          </FilterPill>
          {BANDS.map((b) => (
            <FilterPill
              key={b}
              active={bandFilter === b}
              onClick={() => setBandFilter(bandFilter === b ? null : b)}
            >
              {b}
            </FilterPill>
          ))}
        </div>

        {/* Article list */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {filtered.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setSelectedPassage(p)}
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 12,
                padding: "14px 0",
                borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none",
                background: "none",
                border: "none",
                borderBottomWidth: i < filtered.length - 1 ? 1 : 0,
                borderBottomStyle: "solid",
                borderBottomColor: "#f3f4f6",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                    color: "#111",
                    marginBottom: 2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {p.title}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                  {p.topic}
                </span>
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#16a34a",
                  background: "#f0fdf4",
                  padding: "2px 8px",
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {p.band}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── AI screen ──
  if (screen === "ai") {
    return (
      <div>
        <ScreenHeader title="AI 生成文章" onBack={() => setScreen("home")} />

        <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: 20 }}>选择难度</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
          {BANDS.map((b) => (
            <FilterPill
              key={b}
              active={genLevel === b}
              onClick={() => setGenLevel(b)}
            >
              Band {b}
            </FilterPill>
          ))}
        </div>

        <button
          onClick={generateAI}
          disabled={generating}
          style={{
            width: "100%",
            padding: "13px 0",
            borderRadius: 12,
            background: generating ? "#86efac" : "#16a34a",
            color: "#fff",
            fontSize: "0.9375rem",
            fontWeight: 600,
            border: "none",
            cursor: generating ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "background 0.15s",
          }}
        >
          {generating ? (
            <><Loader2 size={15} className="animate-spin" /> 生成中...</>
          ) : (
            <><Sparkles size={15} /> 生成文章</>
          )}
        </button>

        {(genContent || generating) && (
          <div style={{ marginTop: 32, maxWidth: 680, marginLeft: "auto", marginRight: "auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <span style={{ fontSize: "0.8125rem", color: "#9ca3af" }}>预览</span>
              {!generating && genContent && (
                <button
                  onClick={saveGenerated}
                  disabled={savingGenerated}
                  style={{
                    fontSize: "0.8125rem",
                    color: savingGenerated ? "#86efac" : "#16a34a",
                    fontWeight: 600,
                    background: "none",
                    border: "none",
                    cursor: savingGenerated ? "default" : "pointer",
                    padding: 0,
                  }}
                >
                  {savingGenerated ? "保存中..." : "保存到文库"}
                </button>
              )}
            </div>
            {genSaveMessage && (
              <p style={{ fontSize: "0.8125rem", color: genSaveMessage.startsWith("已") ? "#16a34a" : "#ef4444", marginBottom: 16 }}>
                {genSaveMessage}
              </p>
            )}
            <ArticleBody
              content={genContent + (generating ? "▍" : "")}
              onWordClick={handleWordClick}
              onTextSelect={handleTextSelect}
            />
          </div>
        )}

        {!generating && genContent.trim() && (
          <AskPanelOverlay
            articleTitle={getGeneratedTitle(genContent.trim(), genLevel)}
            articleContent={genContent.trim()}
            open={askPanelOpen}
            onOpenChange={setAskPanelOpen}
            draftQuestion={askDraftQuestion}
            draftQuestionKey={askDraftKey}
          />
        )}
      </div>
    );
  }

  // ── Saved screen ──
  return (
    <div>
      <ScreenHeader title="已保存" onBack={() => setScreen("home")} />
      {loadingSaved ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#9ca3af", fontSize: "0.875rem" }}>
          <Loader2 size={14} className="animate-spin" /> 加载中...
        </div>
      ) : savedMaterials.length === 0 ? (
        <p style={{ fontSize: "0.9375rem", color: "#9ca3af", marginTop: 12 }}>
          还没有保存的文章。去 AI 生成一篇吧。
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {savedMaterials.map((m, i) => (
            <div
              key={m.id}
              onClick={() => setSelectedPassage(m)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "14px 0",
                borderBottom: i < savedMaterials.length - 1 ? "1px solid #f3f4f6" : "none",
                cursor: "pointer",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                    color: "#111",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {m.title}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                  Band {m.proficiency_level}
                </span>
              </div>
              <button
                onClick={(e) => deleteSaved(m.id, e)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#d1d5db",
                  padding: 4,
                  borderRadius: 6,
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d5db")}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

// ── Sub-components ──

function HomeButton({
  label,
  sub,
  onClick,
}: {
  label: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "18px 20px",
        borderRadius: 14,
        border: "1px solid #e5e7eb",
        background: "#fff",
        textAlign: "left",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "border-color 0.15s, background 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#16a34a";
        e.currentTarget.style.background = "#f9fafb";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e5e7eb";
        e.currentTarget.style.background = "#fff";
      }}
    >
      <div>
        <div style={{ fontSize: "1rem", fontWeight: 600, color: "#111", marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: "0.8125rem", color: "#9ca3af" }}>{sub}</div>
      </div>
      <span style={{ fontSize: "1.25rem", color: "#d1d5db" }}>›</span>
    </button>
  );
}

function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: "0.875rem",
          color: "#6b7280",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <ArrowLeft size={14} />
        返回
      </button>
      <span style={{ color: "#e5e7eb" }}>|</span>
      <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#111", margin: 0 }}>{title}</h2>
    </div>
  );
}

function FilterPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 14px",
        borderRadius: 999,
        fontSize: "0.8125rem",
        fontWeight: 500,
        border: `1px solid ${active ? "#16a34a" : "#e5e7eb"}`,
        background: active ? "#16a34a" : "#fff",
        color: active ? "#fff" : "#6b7280",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}
