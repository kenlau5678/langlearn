"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { streamRequest } from "@/lib/api";
import { Send, Loader2, Bot, User, Sparkles } from "lucide-react";

interface AskPanelProps {
  articleTitle?: string;
  articleContent: string;
  targetLanguage?: string;
}

const SUGGESTIONS = ["总结大意", "解释难句", "出题思路", "写作借鉴"];

export default function AskPanel({
  articleTitle,
  articleContent,
  targetLanguage = "en",
}: AskPanelProps) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hi，我可以帮你理解这篇文章。想问什么？" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendQuestion = useCallback(
    async (question: string) => {
      if (!question.trim() || loading) return;

      setMessages((prev) => [...prev, { role: "user", text: question }]);
      setInput("");
      setLoading(true);

      let reply = "";
      // Add a streaming placeholder for the assistant
      setMessages((prev) => [...prev, { role: "assistant", text: "" }]);

      await streamRequest(
        "/ask/chat",
        {
          article_title: articleTitle,
          article_content: articleContent,
          question,
          target_language: targetLanguage,
        },
        {
          onToken: (text) => {
            reply += text;
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
        }
      );
    },
    [articleTitle, articleContent, targetLanguage, loading]
  );

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    sendQuestion(input);
  };

  return (
    <div className="flex flex-col h-full bg-white border border-[#e5e7eb] rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e5e7eb] bg-[#f9fafb]">
        <Bot size={18} className="text-[#16a34a]" />
        <span className="font-semibold text-sm text-[#111]">Ask AI</span>
        <Sparkles size={14} className="text-[#16a34a] ml-auto" />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[240px]">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
              m.role === "user" ? "bg-[#16a34a] text-white" : "bg-[#f0fdf4] text-[#16a34a]"
            }`}>
              {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={`max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap rounded-xl px-3 py-2 ${
              m.role === "user"
                ? "bg-[#16a34a] text-white rounded-tr-none"
                : "bg-[#f3f4f6] text-[#1f2937] rounded-tl-none"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && messages[messages.length - 1]?.role === "assistant" && messages[messages.length - 1].text === "" && (
          <div className="flex gap-2">
            <div className="shrink-0 w-7 h-7 rounded-full bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center">
              <Bot size={14} />
            </div>
            <div className="bg-[#f3f4f6] rounded-xl rounded-tl-none px-3 py-2 text-sm text-[#6b7280] flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              思考中…
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="px-4 pt-2 pb-1 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => sendQuestion(s)}
            disabled={loading}
            className="text-xs px-2.5 py-1 rounded-full border border-[#e5e7eb] text-[#6b7280] hover:border-[#16a34a] hover:text-[#16a34a] transition-colors disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[#e5e7eb] bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入问题…"
            disabled={loading}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-[#e5e7eb] focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-3 py-2 rounded-lg bg-[#16a34a] text-white hover:bg-[#15803d] disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
