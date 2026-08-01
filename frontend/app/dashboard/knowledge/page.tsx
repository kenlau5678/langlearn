"use client";

import { useAppStore } from "@/lib/store";
import { knowledgePointsAPI, progressAPI } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";
import { Plus, Check } from "lucide-react";

interface KnowledgePoint {
  id: string;
  target_language: string;
  type: string;
  proficiency_level: string;
  level_system: string;
  surface_form: string;
  reading: string | null;
  pronunciation: string | null;
  meaning_zh: string;
  meaning_en: string | null;
  pos: string | null;
  explanation_zh: string | null;
  example_target: string[] | null;
  example_zh: string[] | null;
  metadata: Record<string, unknown>;
  source: string | null;
  is_verified: boolean;
  created_at: string;
}

const tabs = [
  { key: "vocabulary", label: "词汇" },
  { key: "grammar", label: "语法" },
  { key: "kanji", label: "汉字" },
  { key: "idiom", label: "习语" },
  { key: "phrasal_verb", label: "动词短语" },
];

const jaLevels = ["全部", "N5", "N4", "N3"];
const enLevels = ["全部", "4.0", "5.0", "5.5", "6.0", "6.5", "7.0"];

export default function KnowledgePage() {
  const { selectedLanguage } = useAppStore();
  const [activeTab, setActiveTab] = useState("vocabulary");
  const [kps, setKps] = useState<KnowledgePoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [levelFilter, setLevelFilter] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchKps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {
        type: activeTab,
        page,
        page_size: 20,
      };
      if (selectedLanguage !== "all") {
        params.target_language = selectedLanguage;
      }
      if (levelFilter !== "全部") {
        params.proficiency_level = levelFilter;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await knowledgePointsAPI.list(params as Parameters<typeof knowledgePointsAPI.list>[0]);
      const data = response as { data: KnowledgePoint[]; meta: { total: number; total_pages: number } };
      setKps(data.data || []);
      setTotal(data.meta?.total || 0);
      setTotalPages(data.meta?.total_pages || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }, [selectedLanguage, activeTab, page, levelFilter, searchQuery]);

  useEffect(() => {
    fetchKps();
  }, [fetchKps]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [activeTab, selectedLanguage, levelFilter, searchQuery]);

  // Reset level filter when language changes
  useEffect(() => {
    setLevelFilter("全部");
  }, [selectedLanguage]);

  const getLanguageBadge = (lang: string) => {
    if (lang === "ja") return { text: "日", color: "bg-red-100 text-red-700" };
    return { text: "英", color: "bg-blue-100 text-blue-700" };
  };

  const levelOptions = selectedLanguage === "en" ? enLevels : jaLevels;

  const getLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      // JLPT levels
      N5: "bg-green-100 text-green-700",
      N4: "bg-blue-100 text-blue-700",
      N3: "bg-yellow-100 text-yellow-700",
      N2: "bg-orange-100 text-orange-700",
      N1: "bg-red-100 text-red-700",
      // IELTS bands
      "4.0": "bg-green-100 text-green-700",
      "4.5": "bg-green-100 text-green-700",
      "5.0": "bg-blue-100 text-blue-700",
      "5.5": "bg-blue-100 text-blue-700",
      "6.0": "bg-yellow-100 text-yellow-700",
      "6.5": "bg-orange-100 text-orange-700",
      "7.0": "bg-red-100 text-red-700",
    };
    return colors[level] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">知识点</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            浏览
            {selectedLanguage === "en"
              ? "英语"
              : selectedLanguage === "ja"
                ? "日语"
                : "所有"}
            知识点库 {total > 0 && `· 共 ${total} 条`}
          </p>
        </div>
      </div>

      {/* Type tabs */}
      <div className="flex gap-1 border-b border-[var(--border)]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-[var(--primary)] text-[var(--primary)]"
                : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex gap-3 flex-wrap">
        {/* Level filter */}
        <div className="flex gap-1">
          {levelOptions.map((level) => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                levelFilter === level
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)]"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="搜索知识点..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin h-8 w-8 border-3 border-[var(--primary)] border-t-transparent rounded-full" />
          <span className="ml-3 text-[var(--muted-foreground)]">加载中...</span>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={fetchKps}
            className="mt-3 px-4 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            重试
          </button>
        </div>
      ) : kps.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] p-12 text-center">
          <p className="text-[var(--muted-foreground)] mb-2">
            暂无数据。请先在管理面板导入JLPT参考数据。
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">
            POST /api/v1/admin/ingest/all?target_language=ja
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {kps.map((kp) => {
            const langBadge = getLanguageBadge(kp.target_language);
            const isExpanded = expandedId === kp.id;
            const strokeCount =
              typeof kp.metadata?.stroke_count === "number"
                ? kp.metadata.stroke_count
                : null;
            const grade =
              typeof kp.metadata?.grade === "number" ? kp.metadata.grade : null;
            const readingsOn = Array.isArray(kp.metadata?.readings_on)
              ? kp.metadata.readings_on.filter((item): item is string => typeof item === "string")
              : [];

            return (
              <div
                key={kp.id}
                className="rounded-lg border border-[var(--border)] hover:border-[var(--primary)]/30 transition-colors overflow-hidden"
              >
                {/* Card header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : kp.id)}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left"
                >
                  {/* Language badge */}
                  <span
                    className={`px-1.5 py-0.5 text-xs font-medium rounded ${langBadge.color}`}
                  >
                    {langBadge.text}
                  </span>

                  {/* Level badge */}
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded ${getLevelBadge(kp.proficiency_level)}`}
                  >
                    {kp.proficiency_level}
                  </span>

                  {/* Surface form */}
                  <span className="font-medium text-lg">{kp.surface_form}</span>

                  {/* Reading */}
                  {kp.reading && kp.reading !== kp.surface_form && (
                    <span className="text-sm text-[var(--muted-foreground)]">
                      [{kp.reading}]
                    </span>
                  )}

                  {/* Pronunciation */}
                  {kp.pronunciation && (
                    <span className="text-xs text-[var(--muted-foreground)]">
                      /{kp.pronunciation}/
                    </span>
                  )}

                  {/* Meaning */}
                  <span className="ml-auto text-sm text-[var(--muted-foreground)] truncate max-w-[300px]">
                    {kp.meaning_zh}
                  </span>

                  {/* POS tag */}
                  {kp.pos && (
                    <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                      {kp.pos}
                    </span>
                  )}

                  {/* Expand icon */}
                  <span className={`text-xs text-[var(--muted-foreground)] transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-[var(--border)] bg-[var(--muted)]/30 space-y-3">
                    {/* Meaning row */}
                    <div className="pt-3 grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-[var(--muted-foreground)] block">中文释义</span>
                        <span className="text-sm">{kp.meaning_zh}</span>
                      </div>
                      {kp.meaning_en && (
                        <div>
                          <span className="text-xs text-[var(--muted-foreground)] block">English</span>
                          <span className="text-sm">{kp.meaning_en}</span>
                        </div>
                      )}
                    </div>

                    {/* Explanation */}
                    {kp.explanation_zh && (
                      <div>
                        <span className="text-xs text-[var(--muted-foreground)] block">语法说明</span>
                        <p className="text-sm mt-1">{kp.explanation_zh}</p>
                      </div>
                    )}

                    {/* Examples */}
                    {kp.example_target && kp.example_target.length > 0 && (
                      <div>
                        <span className="text-xs text-[var(--muted-foreground)] block">例句</span>
                        {kp.example_target.map((ex, i) => (
                          <div key={i} className="mt-1 text-sm">
                            <p>{ex}</p>
                            {kp.example_zh && kp.example_zh[i] && (
                              <p className="text-[var(--muted-foreground)]">{kp.example_zh[i]}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Metadata for kanji */}
                    {kp.type === "kanji" && kp.metadata && (
                      <div className="grid grid-cols-3 gap-2">
                        {strokeCount !== null && (
                          <div className="text-center p-2 bg-white rounded">
                            <span className="text-xs text-[var(--muted-foreground)] block">笔画</span>
                            <span className="font-medium">{strokeCount}</span>
                          </div>
                        )}
                        {grade !== null && (
                          <div className="text-center p-2 bg-white rounded">
                            <span className="text-xs text-[var(--muted-foreground)] block">学年</span>
                            <span className="font-medium">{grade}</span>
                          </div>
                        )}
                        {readingsOn.length > 0 && (
                          <div className="p-2 bg-white rounded">
                            <span className="text-xs text-[var(--muted-foreground)] block">音读</span>
                            <span className="text-sm">{readingsOn.join("、")}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Add to review deck button */}
                    <AddToDeckButton knowledgePointId={kp.id} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] disabled:opacity-50 hover:bg-[var(--accent)]"
              >
                上一页
              </button>
              <span className="text-sm text-[var(--muted-foreground)]">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border)] disabled:opacity-50 hover:bg-[var(--accent)]"
              >
                下一页
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AddToDeckButton({ knowledgePointId }: { knowledgePointId: string }) {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (loading || added) return;
    setLoading(true);
    try {
      await progressAPI.addCard(knowledgePointId);
      setAdded(true);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading || added}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
        added
          ? "bg-green-100 text-green-700 cursor-default"
          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
      } disabled:opacity-70`}
    >
      {added ? (
        <>
          <Check size={12} />
          已加入复习
        </>
      ) : (
        <>
          <Plus size={12} />
          {loading ? "添加中..." : "加入复习卡组"}
        </>
      )}
    </button>
  );
}
