import Link from "next/link";
import { BookOpen, Highlighter, RotateCcw } from "lucide-react";

const highlights = [
  { icon: BookOpen, text: "IELTS 阅读" },
  { icon: Highlighter, text: "选中问 AI" },
  { icon: RotateCcw, text: "单词复习" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-[var(--foreground)]">
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-3 text-[var(--primary)] hover:no-underline">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
              <BookOpen size={18} />
            </span>
            <span className="text-base font-extrabold">LangLearn</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-[#64748b] hover:bg-[#f8fafc] hover:text-[#111827] hover:no-underline"
            >
              登录
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--primary-hover)] hover:no-underline"
            >
              注册
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-3xl flex-col items-center justify-center px-5 py-16 text-center">
        <h1 className="text-4xl font-black tracking-normal text-[#0f172a] sm:text-5xl">
          LangLearn
        </h1>
        <p className="mt-4 max-w-xl text-base leading-8 text-[#64748b]">
          读英语文章、问 AI 解释、复习不熟的单词。一个轻量的个人英语学习工具。
        </p>

        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--primary)] px-7 text-sm font-extrabold text-white hover:bg-[var(--primary-hover)] hover:no-underline"
          >
            免费开始
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--border)] px-7 text-sm font-bold text-[#334155] hover:border-[#bbf7d0] hover:text-[var(--primary)] hover:no-underline"
          >
            已有账号
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {highlights.map((item) => (
            <span
              key={item.text}
              className="inline-flex items-center gap-2 rounded-full border border-[#dcfce7] bg-[#f0fdf4] px-4 py-2 text-sm font-semibold text-[var(--primary)]"
            >
              <item.icon size={15} />
              {item.text}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
