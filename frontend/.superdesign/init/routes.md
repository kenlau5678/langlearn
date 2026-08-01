# Routes

## App Routes
- `/` -> `app/page.tsx`: landing/root page.
- `/login` -> `app/login/page.tsx`: login form.
- `/register` -> `app/register/page.tsx`: register form.
- `/dashboard` -> `app/dashboard/page.tsx`: daily overview, progress, primary actions.
- `/dashboard/materials` -> `app/dashboard/materials/page.tsx`: IELTS passage library, AI article generator, reading view.
- `/dashboard/review` -> `app/dashboard/review/page.tsx`: spaced-repetition flashcard review.
- `/dashboard/learn` -> `app/dashboard/learn/page.tsx`: AI lesson generation and quick vocab cards.
- `/dashboard/knowledge` -> `app/dashboard/knowledge/page.tsx`: knowledge point browser.
- `/dashboard/generate` -> `app/dashboard/generate/page.tsx`: material generator.
- `/dashboard/admin` -> `app/dashboard/admin/page.tsx`: admin ingestion utilities.

All `/dashboard/*` routes use `app/dashboard/layout.tsx`.
