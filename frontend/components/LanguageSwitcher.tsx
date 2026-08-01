"use client";

import { useAppStore } from "@/lib/store";

const languages = [
  { key: "all" as const, label: "全部", icon: "📚" },
  { key: "en" as const, label: "英语", icon: "🇬🇧" },
  { key: "ja" as const, label: "日语", icon: "🇯🇵" },
];

export function LanguageSwitcher() {
  const { selectedLanguage, setLanguage } = useAppStore();

  return (
    <div className="flex gap-1 rounded-lg bg-[var(--secondary)] p-1">
      {languages.map((lang) => (
        <button
          key={lang.key}
          onClick={() => setLanguage(lang.key)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            selectedLanguage === lang.key
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          <span>{lang.icon}</span>
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  );
}
