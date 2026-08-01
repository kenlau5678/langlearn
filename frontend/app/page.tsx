import Link from "next/link";
import { BookOpen, RotateCcw, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-white" />
          </span>
          <span className="font-bold text-[var(--foreground)]">英语学习</span>
        </div>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            登录
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold px-4 py-1.5 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors"
          >
            注册
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-lg space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
            LangLearn
          </h1>
          <p className="text-base text-[var(--muted-foreground)] leading-relaxed">
            AI 驱动的英语学习工具，帮你阅读、理解、记住单词。
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-hover)] transition-colors text-base"
            >
              免费开始
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 rounded-xl border-2 border-[var(--border)] text-[var(--foreground)] font-semibold hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors text-base"
            >
              已有账号
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 pb-16">
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: BookOpen,
              title: "AI 阅读",
              desc: "按 IELTS 难度生成文章，选中单词即可查看解释",
            },
            {
              icon: RotateCcw,
              title: "间隔记忆",
              desc: "SM-2 算法科学安排复习时间，不再忘词",
            },
            {
              icon: Sparkles,
              title: "AI 解释",
              desc: "选中不懂的词，AI 用中文解释语法和用法",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-[var(--border)] p-5 text-center space-y-2"
            >
              <div className="inline-flex p-2.5 rounded-lg bg-[var(--accent)] mx-auto">
                <f.icon className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <h3 className="font-semibold text-sm">{f.title}</h3>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
