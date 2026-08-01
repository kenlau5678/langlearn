"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, Lock, Mail } from "lucide-react";
import { authAPI } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authAPI.login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "登录失败，请检查邮箱和密码");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-copy">
          <div className="auth-brand">
            <span>
              <BookOpen size={20} />
            </span>
            LangLearn
          </div>
          <h1>继续你的英语阅读节奏</h1>
          <p>打开文章、查看高亮词汇、让 AI 帮你拆句和总结。电脑和手机上都保持同一套学习体验。</p>
        </div>

        <div className="auth-card">
          <div className="auth-card-head">
            <h2>登录</h2>
            <p>欢迎回来，继续学习。</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            <label>
              <span>邮箱</span>
              <div className="auth-input">
                <Mail size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  placeholder="your@email.com"
                />
              </div>
            </label>

            <label>
              <span>密码</span>
              <div className="auth-input">
                <Lock size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="输入密码"
                />
              </div>
            </label>

            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? "登录中..." : "登录"}
            </button>
          </form>

          <p className="auth-switch">
            还没有账号？<Link href="/register">注册</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
