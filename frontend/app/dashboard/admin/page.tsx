"use client";

import { adminAPI } from "@/lib/api";
import { useState } from "react";

type Lang = "ja" | "en";

interface PipelineResult {
  message: string;
  [key: string]: unknown;
}

export default function AdminPage() {
  const [lang, setLang] = useState<Lang>("ja");
  const [running, setRunning] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, PipelineResult | null>>({});
  const [error, setError] = useState<string | null>(null);

  const runAction = async (key: string, fn: () => Promise<unknown>) => {
    setRunning(key);
    setError(null);
    try {
      const result = await fn();
      setResults((prev) => ({ ...prev, [key]: result as PipelineResult }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败");
    } finally {
      setRunning(null);
    }
  };

  const jaActions = [
    {
      key: "ja-all",
      label: "导入全部日语数据",
      description: "导入JLPT N5+N4词汇、语法、汉字参考数据",
      fn: () => adminAPI.ingestAll("ja"),
    },
    {
      key: "ja-vocab",
      label: "导入日语词汇",
      description: "仅导入JLPT N5+N4词汇数据",
      fn: () => adminAPI.ingestVocabulary("ja"),
    },
    {
      key: "ja-grammar",
      label: "导入日语语法",
      description: "仅导入JLPT N5+N4语法模式数据",
      fn: () => adminAPI.ingestGrammar("ja"),
    },
    {
      key: "ja-kanji",
      label: "导入汉字",
      description: "仅导入JLPT N5+N4汉字数据",
      fn: () => adminAPI.ingestKanji("ja"),
    },
  ];

  const enActions = [
    {
      key: "en-all",
      label: "导入全部英语数据",
      description: "导入IELTS词汇和语法参考数据",
      fn: () => adminAPI.ingestAll("en"),
    },
    {
      key: "en-vocab",
      label: "导入英语词汇",
      description: "导入IELTS CEFR B2-C2（Band 6.5-8.5）词汇数据",
      fn: () => adminAPI.ingestVocabulary("en"),
    },
    {
      key: "en-grammar",
      label: "导入英语语法",
      description: "导入英语语法模式数据（按IELTS难度分级）",
      fn: () => adminAPI.ingestGrammar("en"),
    },
  ];

  const currentActions = lang === "ja" ? jaActions : enActions;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">管理面板</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          导入英语与日语参考数据
        </p>
      </div>

      {/* Language selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setLang("ja")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            lang === "ja"
              ? "bg-[var(--primary)] text-white"
              : "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted)]/80"
          }`}
        >
          日语 (JLPT)
        </button>
        <button
          onClick={() => setLang("en")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            lang === "en"
              ? "bg-[var(--primary)] text-white"
              : "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted)]/80"
          }`}
        >
          英语 (IELTS)
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Language-specific actions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          {lang === "ja" ? "日语数据导入" : "英语数据导入"}
        </h2>
        <div className="grid gap-4">
          {currentActions.map((action) => (
            <ActionCard
              key={action.key}
              action={action}
              running={running}
              result={results[action.key]}
              onRun={runAction}
            />
          ))}
        </div>
      </div>

    </div>
  );
}

function ActionCard({
  action,
  running,
  result,
  onRun,
}: {
  action: { key: string; label: string; description: string; fn: () => Promise<unknown> };
  running: string | null;
  result: PipelineResult | null | undefined;
  onRun: (key: string, fn: () => Promise<unknown>) => void;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-base">{action.label}</h3>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            {action.description}
          </p>
        </div>
        <button
          onClick={() => onRun(action.key, action.fn)}
          disabled={running !== null}
          className="ml-4 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--primary)] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shrink-0"
        >
          {running === action.key ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              运行中...
            </span>
          ) : (
            "执行"
          )}
        </button>
      </div>

      {result && (
        <div className="mt-4 p-3 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
          <pre className="text-xs text-[var(--foreground)] overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
