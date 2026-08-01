# LangLearn Design System

## Product Context
LangLearn is a language-learning web app focused on two primary jobs: reading articles in context and reviewing vocabulary with spaced repetition. The interface should feel like a calm study workspace, not a marketing page.

## Visual Direction
- Use a quiet light workspace: warm gray app background, white surfaces, green as the learning/action color, amber only for gentle prompts.
- Desktop should use a left navigation shell and wide content areas. Mobile should keep bottom navigation.
- Favor clear hierarchy, focused cards, comfortable reading widths, and dense but calm learning controls.

## Tokens
- Background: `#f6f7f9`
- Surface: `#ffffff`
- Soft surface: `#f0f5f3`
- Text: `#17201b`
- Muted text: `#66736d`
- Primary: `#0f8f62`
- Primary hover: `#0b7954`
- Primary light: `#dff7ea`
- Border: `#dce4e0`
- Warning: `#c47a16`
- Radius: `12px` default, `24px` for major focus panels.
- Shadows: subtle only, `0 1px 2px rgb(23 32 27 / 0.06)` and `0 12px 32px rgb(23 32 27 / 0.08)`.

## Components
- App shell: persistent left sidebar on desktop, top bar plus bottom nav on mobile.
- Cards: white surface, 1px border, modest radius, no nested card-heavy marketing layout.
- Buttons: icon plus short action labels, primary green for main actions, neutral borders for secondary.
- Reading: article width around `max-w-4xl`, large title, generous line height, highlighter-style vocabulary marks.
- Review: one large flashcard, visible progress, three rating actions: forgot, unsure, remembered.
