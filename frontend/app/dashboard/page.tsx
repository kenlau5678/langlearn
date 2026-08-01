"use client";

import Link from "next/link";
import { BookOpen, RotateCcw } from "lucide-react";

export default function DashboardPage() {
  return (
    <div style={{ paddingTop: 32 }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: "#111", marginBottom: 4 }}>
          今天学什么？
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
          {new Date().toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "long" })}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Link href="/dashboard/materials" style={{ textDecoration: "none" }}>
          <EntryCard
            icon={<BookOpen size={22} color="#16a34a" />}
            label="阅读文章"
            sub="IELTS 范文 · AI 生成 · 词汇高亮"
          />
        </Link>
        <Link href="/dashboard/review" style={{ textDecoration: "none" }}>
          <EntryCard
            icon={<RotateCcw size={22} color="#16a34a" />}
            label="背单词"
            sub="间隔重复 · 智能复习计划"
          />
        </Link>
      </div>
    </div>
  );
}

function EntryCard({
  icon,
  label,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "20px 20px",
        borderRadius: 14,
        border: "1px solid #e5e7eb",
        background: "#fff",
        cursor: "pointer",
        transition: "border-color 0.15s, background 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#16a34a";
        (e.currentTarget as HTMLDivElement).style.background = "#f9fafb";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e7eb";
        (e.currentTarget as HTMLDivElement).style.background = "#fff";
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "#f0fdf4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "1rem", fontWeight: 600, color: "#111", marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: "0.8125rem", color: "#9ca3af" }}>{sub}</div>
      </div>
      <span style={{ fontSize: "1.25rem", color: "#d1d5db" }}>›</span>
    </div>
  );
}
