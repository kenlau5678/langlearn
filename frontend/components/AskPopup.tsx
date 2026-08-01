"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { streamRequest } from "@/lib/api";
import { X, Send, Loader2 } from "lucide-react";

interface AskPopupProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "explain" | "translate" | "breakdown" | "compare" | "chat";
  selectedText?: string;
  fullSentence?: string;
  targetLanguage?: string;
}

const modeConfig = {
  explain: { title: "语法解释", path: "/ask/explain-grammar" },
  translate: { title: "翻译", path: "/ask/translate" },
  breakdown: { title: "句子分析", path: "/ask/breakdown" },
  compare: { title: "跨语言对比", path: "/ask/compare" },
  chat: { title: "自由提问", path: "" },
};

export default function AskPopup({
  isOpen,
  onClose,
  mode,
  selectedText = "",
  fullSentence = "",
  targetLanguage = "ja",
}: AskPopupProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [history, setHistory] = useState<{ role: string; text: string }[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const config = modeConfig[mode];

  // Auto-scroll to bottom
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [content]);

  // Auto-start stream when opened with text
  useEffect(() => {
    if (isOpen && selectedText && !content) {
      startStream();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const startStream = useCallback(
    async (question?: string) => {
      setLoading(true);
      setContent("");

      const body: Record<string, unknown> = {};
      if (mode === "explain") {
        body.selected_text = selectedText;
        body.full_sentence = fullSentence;
        body.target_language = targetLanguage;
        if (question) body.question = question;
      } else if (mode === "translate") {
        body.text = selectedText;
        body.target_language = "zh";
      } else if (mode === "breakdown") {
        body.text = selectedText;
        body.target_language = targetLanguage;
      } else if (mode === "compare") {
        body.text = selectedText;
        body.language_a = targetLanguage;
        body.language_b = targetLanguage === "ja" ? "en" : "ja";
      }

      try {
        await streamRequest(config.path, body, {
          onToken: (text) => setContent((prev) => prev + text),
          onDone: () => {
            setLoading(false);
            setHistory((prev) => [
              ...prev,
              { role: "user", text: question || selectedText },
              { role: "assistant", text: content },
            ]);
          },
          onError: (msg) => {
            setContent(`错误: ${msg}`);
            setLoading(false);
          },
        });
      } catch {
        setContent("网络请求失败");
        setLoading(false);
      }
    },
    [mode, selectedText, fullSentence, targetLanguage, config.path, content],
  );

  const handleFollowUp = () => {
    if (!followUp.trim()) return;
    setHistory((prev) => [...prev, { role: "user", text: followUp }]);
    startStream(followUp);
    setFollowUp("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-lg max-h-[80vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-[var(--border)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
          <div>
            <h3 className="font-semibold text-base">{config.title}</h3>
            {selectedText && (
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5 truncate max-w-[280px]">
                「{selectedText}」
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap min-h-[200px] max-h-[50vh]"
        >
          {content || (loading && (
            <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
              <Loader2 size={16} className="animate-spin" />
              <span>AI 正在思考中...</span>
            </div>
          ))}
          {loading && content && (
            <span className="inline-block w-0.5 h-4 bg-[var(--primary)] animate-pulse ml-0.5" />
          )}
        </div>

        {/* Follow-up input */}
        <div className="px-4 py-3 border-t border-[var(--border)]">
          <div className="flex gap-2">
            <input
              type="text"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleFollowUp()}
              placeholder="继续追问..."
              disabled={loading}
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:opacity-50"
            />
            <button
              onClick={handleFollowUp}
              disabled={loading || !followUp.trim()}
              className="px-3 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
