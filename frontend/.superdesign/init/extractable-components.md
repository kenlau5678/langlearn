# Extractable Components

## DashboardShell
- Source: `app/dashboard/layout.tsx`
- Category: layout
- Description: Main authenticated learning workspace shell with sidebar, top bar, and mobile bottom nav.
- Extractable props: `activeItem` (string, default: "dashboard")
- Hardcoded: LangLearn brand text, route labels, lucide icon choices, study suggestion copy.

## AskPopup
- Source: `components/AskPopup.tsx`
- Category: basic
- Description: AI explanation/translation modal for selected text.
- Extractable props: `mode`, `selectedText`, `targetLanguage`, `isOpen`
- Hardcoded: modal layout, stream content area, follow-up input structure.

## LanguageSwitcher
- Source: `components/LanguageSwitcher.tsx`
- Category: basic
- Description: Segmented language selector.
- Extractable props: `selectedLanguage`
- Hardcoded: language labels and icons.
