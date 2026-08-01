# Components

Framework: React 19 with Next.js 15 App Router. Component library: custom React components with `lucide-react` icons. CSS approach: Tailwind v4 plus CSS variables in `app/globals.css`.

## components/AskPopup.tsx
Shared AI explanation modal used by reading and lesson pages.

```tsx
Props: isOpen, onClose, mode, selectedText, fullSentence, targetLanguage.
Renders a fixed backdrop, a white bottom-sheet/modal panel, streaming AI response content, and a follow-up input with send icon.
Source path: components/AskPopup.tsx
```

## components/LanguageSwitcher.tsx
Shared segmented language control.

```tsx
Uses useAppStore selectedLanguage and setLanguage.
Renders buttons for 全部, 英语, 日语.
Source path: components/LanguageSwitcher.tsx
```
