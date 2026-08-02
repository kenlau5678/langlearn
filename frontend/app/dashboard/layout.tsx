"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, LogOut, RotateCcw } from "lucide-react";
import { authAPI, userAPI } from "@/lib/api";

const navItems = [
  { href: "/dashboard/materials", label: "阅读", icon: BookOpen },
  { href: "/dashboard/review", label: "背单词", icon: RotateCcw },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem("access_token");

    if (!token) {
      authAPI.logout();
      router.replace("/login");
      return;
    }

    userAPI
      .getMe()
      .then(() => {
        if (!cancelled) setCheckingAuth(false);
      })
      .catch(() => {
        authAPI.logout();
        router.replace("/login");
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleLogout = () => {
    authAPI.logout();
    router.push("/login");
  };

  if (checkingAuth) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9ca3af",
          fontSize: 14,
        }}
      >
        加载中...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-[var(--border)] bg-white sticky top-0 z-30">
        <div className="app-header-inner">
          <Link href="/dashboard" className="app-brand">
            <span>
              <BookOpen className="h-4 w-4 text-white" />
            </span>
            <strong>LangLearn</strong>
          </Link>

          <nav className="app-header-nav">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} className={isActive ? "active" : ""}>
                  <item.icon className="h-4 w-4" />
                  <span className="app-header-nav-label">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button onClick={handleLogout} className="app-logout" aria-label="退出">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-6">
        <div className="app-main-inner">{children}</div>
      </main>
    </div>
  );
}
