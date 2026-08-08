"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Loader2, Send, Sparkles } from "lucide-react";
import { streamRequest } from "@/lib/api";

interface AskPanelOverlayProps {
  articleTitle?: string;
  articleContent: string;
  targetLanguage?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draftQuestion?: string;
  draftQuestionKey?: number;
  autoSendDraft?: boolean;
}

const SUGGESTIONS = ["总结大意", "解释难句", "出题思路", "写作借鉴"];

export default function AskPanelOverlay({
  articleTitle,
  articleContent,
  targetLanguage = "en",
  open,
  onOpenChange,
  draftQuestion = "",
  draftQuestionKey = 0,
  autoSendDraft = false,
}: AskPanelOverlayProps) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hi，我可以帮你理解这篇文章。想问什么？" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastAutoSentKeyRef = useRef<number | null>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  useEffect(() => {
    if (!draftQuestion) return;
    if (!autoSendDraft) setInput(draftQuestion);
    onOpenChange(true);
    if (!autoSendDraft) setTimeout(() => inputRef.current?.focus(), 80);
  }, [draftQuestion, draftQuestionKey, autoSendDraft, onOpenChange]);

  const sendQuestion = useCallback(
    async (question: string) => {
      const text = question.trim();
      if (!text || loading) return;

      setMessages((prev) => [...prev, { role: "user", text }, { role: "assistant", text: "" }]);
      setInput("");
      setLoading(true);

      let reply = "";
      await streamRequest(
        "/ask/chat",
        {
          article_title: articleTitle,
          article_content: articleContent,
          question: text,
          target_language: targetLanguage,
        },
        {
          onToken: (chunk) => {
            reply += chunk;
            setMessages((prev) => [
              ...prev.slice(0, -1),
              { role: "assistant", text: reply },
            ]);
          },
          onDone: () => setLoading(false),
          onError: (msg) => {
            setMessages((prev) => [
              ...prev.slice(0, -1),
              { role: "assistant", text: `出错了：${msg}` },
            ]);
            setLoading(false);
          },
        },
      );
    },
    [articleTitle, articleContent, targetLanguage, loading],
  );

  useEffect(() => {
    if (
      !autoSendDraft
      || !draftQuestion
      || loading
      || lastAutoSentKeyRef.current === draftQuestionKey
    ) return;
    lastAutoSentKeyRef.current = draftQuestionKey;
    sendQuestion(draftQuestion);
  }, [autoSendDraft, draftQuestion, draftQuestionKey, loading, sendQuestion]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendQuestion(input);
  };

  return (
    <aside className={`ask-dock ${open ? "ask-dock-open" : "ask-dock-closed"}`}>
      {!open && (
        <button
          type="button"
          className="ask-dock-tab"
          onClick={() => onOpenChange(true)}
          aria-expanded={open}
        >
          <span className="ask-dock-tab-title">
            <Bot size={16} />
            文章助手
          </span>
          <ChevronLeft className="ask-dock-desktop-chevron" size={18} />
          <ChevronDown className="ask-dock-mobile-chevron" size={18} />
        </button>
      )}

      {open && (
        <div className="ask-dock-body">
          <div className="ask-dock-title">
            <span className="ask-dock-icon">
              <Bot size={15} />
            </span>
            <div className="ask-dock-heading">文章助手</div>
            <Sparkles size={15} className="ask-dock-sparkle" />
            <button
              type="button"
              className="ask-dock-collapse"
              onClick={() => onOpenChange(false)}
              aria-label="收起文章助手"
            >
              <ChevronRight className="ask-dock-desktop-chevron" size={18} />
              <ChevronUp className="ask-dock-mobile-chevron" size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="ask-dock-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`ask-message ${message.role === "user" ? "ask-message-user" : ""}`}
              >
                <div className="ask-avatar">
                  {message.role === "user" ? "我" : <Bot size={14} />}
                </div>
                <div className="ask-bubble">
                  {message.text || (
                    <span className="ask-loading">
                      <Loader2 size={13} className="animate-spin" />
                      思考中...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="ask-suggestions">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => sendQuestion(suggestion)}
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <form className="ask-input-row" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="输入问题..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="发送">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
