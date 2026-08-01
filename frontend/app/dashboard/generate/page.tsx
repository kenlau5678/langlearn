"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { streamRequest } from "@/lib/api";
import { Sparkles, Loader2, RotateCcw } from "lucide-react";

export default function GeneratePage() {
  const { selectedLanguage } = useAppStore();
  const lang = selectedLanguage === "all" ? "ja" : selectedLanguage;
  const [topic, setTopic] = useState("");
  const [materialType, setMaterialType] = useState("article");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [content]);

  const generate = async () => {
    setLoading(true);
    setContent("");
    const levelSystem = lang === "ja" ? "jlpt" : "ielts";
    const level = lang === "ja" ? "N5" : "5.0";

    try {
      await streamRequest(
        "/generate/material",
        {
          target_language: lang,
          topic: topic || "日常对话",
          material_type: materialType,
          proficiency_level: level,
          level_system: levelSystem,
        },
        {
          onToken: (text) => setContent((prev) => prev + text),
          onDone: () => setLoading(false),
          onError: (msg) => {
            setContent(`错误: ${msg}`);
            setLoading(false);
          },
        },
      );
    } catch {
      setContent("生成失败");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles size={24} />
          AI 生成
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          让AI为你生成{lang === "ja" ? "日语" : "英语"}学习材料和练习
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">主题</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：日常对话、旅行、学术写作..."
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">材料类型</label>
          <div className="flex gap-2">
            {[
              { key: "article", label: "文章" },
              { key: "dialogue", label: "对话" },
              { key: "exercise_set", label: "练习" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setMaterialType(t.key)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  materialType === t.key
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--muted)] text-[var(--foreground)] hover:opacity-80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles size={14} />
              生成
            </>
          )}
        </button>
      </div>

      {(content || loading) && (
        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-4 py-2 bg-[var(--muted)] border-b border-[var(--border)] flex items-center justify-between">
            <span className="text-sm font-medium">生成结果</span>
            <button
              onClick={generate}
              disabled={loading}
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center gap-1"
            >
              <RotateCcw size={12} />
              重新生成
            </button>
          </div>
          <div
            ref={contentRef}
            className="px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto"
          >
            {content}
            {loading && content && (
              <span className="inline-block w-2 h-4 bg-[var(--primary)] animate-pulse ml-0.5" />
            )}
            {!content && loading && (
              <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <Loader2 size={16} className="animate-spin" />
                AI 正在生成内容...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
