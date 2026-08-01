"use client";

import { useAppStore } from "@/lib/store";
import { streamRequest, knowledgePointsAPI, KnowledgePoint } from "@/lib/api";
import { useState, useRef, useEffect, useCallback } from "react";
import AskPopup from "@/components/AskPopup";
import {
  BookOpen, GraduationCap, FileText, Languages,
  Sparkles, Loader2, RotateCcw,
} from "lucide-react";

interface AskState {
  isOpen: boolean;
  mode: "explain" | "translate" | "breakdown" | "compare" | "chat";
  selectedText: string;
  fullSentence?: string;
}

const lessonTypes = [
  { key: "mixed", label: "综合课", icon: Sparkles, desc: "词汇+阅读+语法" },
  { key: "vocab", label: "词汇卡", icon: BookOpen, desc: "5个新词+例句" },
  { key: "reading", label: "短文阅读", icon: FileText, desc: "短文章+词汇标注" },
  { key: "grammar", label: "语法讲解", icon: GraduationCap, desc: "语法点详解" },
];

export default function LearnPage() {
  const { selectedLanguage } = useAppStore();
  const [lang, setLang] = useState<"ja" | "en">(
    (selectedLanguage === "en" ? "en" : "ja") as "ja" | "en"
  );
  const [lessonType, setLessonType] = useState("mixed");
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [vocabCards, setVocabCards] = useState<KnowledgePoint[]>([]);
  const [vocabLoading, setVocabLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Ask popup state
  const [askState, setAskState] = useState<AskState>({
    isOpen: false,
    mode: "chat",
    selectedText: "",
  });

  const levelSystem = lang === "ja" ? "jlpt" : "ielts";
  const level = lang === "ja" ? "N5" : "5.0";

  // Fetch vocab cards from knowledge base
  const fetchVocab = useCallback(async () => {
    setVocabLoading(true);
    try {
      const response = await knowledgePointsAPI.list({
        target_language: lang,
        type: "vocabulary",
        proficiency_level: level,
        page: 1,
        page_size: 6,
      });
      const result = response as KnowledgePoint[] | { data: KnowledgePoint[] };
      setVocabCards(Array.isArray(result) ? result : result.data || []);
    } catch {
      // silent fail for vocab cards
    } finally {
      setVocabLoading(false);
    }
  }, [lang, level]);

  useEffect(() => {
    fetchVocab();
  }, [fetchVocab]);

  // Auto-scroll streaming content
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [content]);

  const generateLesson = async () => {
    setLoading(true);
    setContent("");

    const body: Record<string, unknown> = {
      target_language: lang,
      lesson_type: lessonType,
      proficiency_level: level,
      level_system: levelSystem,
    };
    if (topic.trim()) body.topic = topic.trim();

    try {
      await streamRequest("/generate/lesson", body, {
        onToken: (text) => setContent((prev) => prev + text),
        onDone: () => setLoading(false),
        onError: (msg) => {
          setContent(`错误: ${msg}`);
          setLoading(false);
        },
      });
    } catch {
      setContent("网络请求失败");
      setLoading(false);
    }
  };

  // Handle text selection for ask popup
  const handleTextSelect = () => {
    const selection = window.getSelection()?.toString().trim();
    if (selection && selection.length > 0 && selection.length < 200) {
      setAskState({
        isOpen: true,
        mode: "explain",
        selectedText: selection,
        fullSentence: content.slice(
          Math.max(0, content.indexOf(selection) - 50),
          content.indexOf(selection) + selection.length + 50
        ),
      });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap size={28} />
          碎片学习
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          5-10分钟一课，随时随地学{lang === "ja" ? "日语" : "英语"}
        </p>
      </div>

      {/* Language toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setLang("ja")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            lang === "ja"
              ? "bg-red-600 text-white"
              : "bg-[var(--muted)] text-[var(--foreground)] hover:opacity-80"
          }`}
        >
          🇯🇵 日语
        </button>
        <button
          onClick={() => setLang("en")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            lang === "en"
              ? "bg-blue-600 text-white"
              : "bg-[var(--muted)] text-[var(--foreground)] hover:opacity-80"
          }`}
        >
          🇬🇧 英语
        </button>
      </div>

      {/* Lesson type selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {lessonTypes.map((lt) => {
          const Icon = lt.icon;
          return (
            <button
              key={lt.key}
              onClick={() => setLessonType(lt.key)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                lessonType === lt.key
                  ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-sm"
                  : "border-[var(--border)] hover:border-[var(--primary)]/30"
              }`}
            >
              <Icon size={20} className="mb-2 text-[var(--primary)]" />
              <div className="font-semibold text-sm">{lt.label}</div>
              <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{lt.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Topic input + Generate */}
      <div className="flex gap-3">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="可选：输入主题（如：旅行、美食、工作...）"
          className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--border)] bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
        />
        <button
          onClick={generateLesson}
          disabled={loading}
          className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white font-medium text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-2 shrink-0"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              开始学习
            </>
          )}
        </button>
      </div>

      {/* AI Generated lesson content */}
      {(content || loading) && (
        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-4 py-2 bg-[var(--muted)] border-b border-[var(--border)] flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Sparkles size={14} className="text-[var(--primary)]" />
              AI 课程内容
            </span>
            <button
              onClick={generateLesson}
              disabled={loading}
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1"
            >
              <RotateCcw size={12} />
              重新生成
            </button>
          </div>
          <div
            ref={contentRef}
            onMouseUp={handleTextSelect}
            className="px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto cursor-text select-text"
          >
            {content}
            {loading && content && (
              <span className="inline-block w-2 h-4 bg-[var(--primary)] animate-pulse ml-0.5" />
            )}
            {!content && loading && (
              <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <Loader2 size={16} className="animate-spin" />
                AI 导师正在为您准备课程内容...
              </div>
            )}
          </div>
          {content && !loading && (
            <div className="px-4 py-2 border-t border-[var(--border)] text-xs text-[var(--muted-foreground)]">
              💡 选中任意文字 → 弹出解释/翻译/分析
            </div>
          )}
        </div>
      )}

      {/* Quick vocab cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen size={20} />
            速记词汇
          </h2>
          <button
            onClick={fetchVocab}
            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1"
          >
            <RotateCcw size={12} />
            换一批
          </button>
        </div>

        {vocabLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 size={20} className="animate-spin text-[var(--muted-foreground)]" />
          </div>
        ) : vocabCards.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {vocabCards.map((kp) => {
              return (
                <VocabCard
                  key={kp.id}
                  surfaceForm={kp.surface_form}
                  reading={kp.reading}
                  pronunciation={kp.pronunciation}
                  meaningZh={kp.meaning_zh}
                  pos={kp.pos}
                  level={kp.proficiency_level}
                  lang={lang}
                  onAsk={(mode, text) =>
                    setAskState({
                      isOpen: true,
                      mode,
                      selectedText: text,
                    })
                  }
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-[var(--muted-foreground)]">
            请先在管理面板导入{lang === "ja" ? "日语" : "英语"}词汇数据
          </div>
        )}
      </div>

      {/* Ask popup */}
      <AskPopup
        isOpen={askState.isOpen}
        onClose={() => setAskState((s) => ({ ...s, isOpen: false }))}
        mode={askState.mode}
        selectedText={askState.selectedText}
        fullSentence={askState.fullSentence}
        targetLanguage={lang}
      />
    </div>
  );
}

function VocabCard({
  surfaceForm,
  reading,
  pronunciation,
  meaningZh,
  pos,
  level,
  lang,
  onAsk,
}: {
  surfaceForm: string;
  reading: string | null;
  pronunciation: string | null;
  meaningZh: string;
  pos: string | null;
  level: string;
  lang: string;
  onAsk: (mode: "explain" | "translate" | "breakdown" | "compare", text: string) => void;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-bold text-lg">{surfaceForm}</div>
          {(reading || pronunciation) && (
            <div className="text-sm text-[var(--muted-foreground)] mt-0.5">
              {reading && <span>{reading}</span>}
              {pronunciation && <span className="ml-2 text-xs">/{pronunciation}/</span>}
            </div>
          )}
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
          {level}
        </span>
      </div>

      <div className="mt-2 text-sm">{meaningZh}</div>

      {pos && (
        <div className="mt-1 text-xs text-[var(--muted-foreground)]">
          {pos}
        </div>
      )}

      {/* Quick actions */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onAsk("explain", surfaceForm)}
          className="text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          语法解释
        </button>
        <button
          onClick={() => onAsk("translate", surfaceForm)}
          className="text-xs px-2.5 py-1 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
        >
          翻译
        </button>
        <button
          onClick={() => onAsk("compare", surfaceForm)}
          className="text-xs px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
        >
          <Languages size={10} className="inline mr-0.5" />
          对比
        </button>
      </div>
    </div>
  );
}
