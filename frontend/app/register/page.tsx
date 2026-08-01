"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, Lock, Mail, User } from "lucide-react";
import { authAPI } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authAPI.register(email, displayName, password);
      await authAPI.login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "注册失败，请稍后重试");
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
          <h1>建立自己的阅读词库</h1>
          <p>从 IELTS 范文开始积累词汇，配合复习卡片和 AI 讲解，把阅读变成稳定的小习惯。</p>
        </div>

        <div className="auth-card">
          <div className="auth-card-head">
            <h2>创建账号</h2>
            <p>几秒钟就能开始。</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            <label>
              <span>昵称</span>
              <div className="auth-input">
                <User size={16} />
                <input
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  required
                  autoComplete="name"
                  placeholder="你的名字"
                />
              </div>
            </label>

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
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="至少 6 个字符"
                />
              </div>
            </label>

            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? "注册中..." : "注册并进入"}
            </button>
          </form>

          <p className="auth-switch">
            已有账号？<Link href="/login">登录</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
