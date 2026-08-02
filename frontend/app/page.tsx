import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fff", color: "#111827" }}>
      <header style={{ height: 64, borderBottom: "1px solid #e5e7eb" }}>
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              color: "#16a34a",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                background: "#16a34a",
                color: "#fff",
              }}
            >
              <BookOpen size={18} />
            </span>
            LangLearn
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link
              href="/login"
              style={{
                color: "#16a34a",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                padding: "8px 10px",
              }}
            >
              登录
            </Link>
            <Link
              href="/register"
              style={{
                height: 36,
                minWidth: 72,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                background: "#16a34a",
                color: "#fff",
                fontSize: 14,
                fontWeight: 800,
                textDecoration: "none",
                padding: "0 18px",
              }}
            >
              注册
            </Link>
          </div>
        </div>
      </header>

      <section
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: 640 }}>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(44px, 7vw, 72px)",
              lineHeight: 1.05,
              fontWeight: 900,
              letterSpacing: 0,
              color: "#0f172a",
            }}
          >
            LangLearn
          </h1>
          <p
            style={{
              margin: "18px auto 0",
              maxWidth: 540,
              color: "#64748b",
              fontSize: 17,
              lineHeight: 1.8,
            }}
          >
            读英语文章、问 AI 解释、复习不熟的单词。一个轻量的个人英语学习工具。
          </p>

          <div
            style={{
              marginTop: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/register"
              style={{
                height: 48,
                minWidth: 132,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                background: "#16a34a",
                color: "#fff",
                fontSize: 15,
                fontWeight: 800,
                textDecoration: "none",
                padding: "0 26px",
              }}
            >
              免费开始
            </Link>
            <Link
              href="/login"
              style={{
                height: 48,
                minWidth: 132,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                background: "#fff",
                color: "#334155",
                fontSize: 15,
                fontWeight: 800,
                textDecoration: "none",
                padding: "0 26px",
              }}
            >
              已有账号
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
