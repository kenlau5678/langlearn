import { create } from "zustand";

type Language = "en" | "ja" | "all";

interface AppState {
  selectedLanguage: Language;
  setLanguage: (lang: Language) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedLanguage: "all",
  setLanguage: (lang) => set({ selectedLanguage: lang }),
}));
