# LangLearn Deployment

Recommended personal setup:

- Frontend: Vercel
- Backend: Railway Hobby
- Database: Neon Free Postgres
- AI: OpenAI API

## 0. Before Pushing

Rotate any OpenAI key that has ever been saved in a local `.env` file, then keep the new key only in cloud environment variables.

## 1. Neon

1. Create a Neon project.
2. Copy the pooled connection string for the app runtime.
3. Copy the direct connection string for migrations.
4. Use URLs in these forms:

```env
DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST/DB?ssl=require
SYNC_DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?ssl=require
```

## 2. Railway Backend

Create a Railway service from the GitHub repo and set the service root directory to:

```text
backend
```

Set environment variables:

```env
DATABASE_URL=postgresql+asyncpg://...
SYNC_DATABASE_URL=postgresql://...
JWT_SECRET=replace-with-a-long-random-secret
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60
OPENAI_API_KEY=sk-...
OPENAI_CHAT_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_MAX_TOKENS=4096
CORS_ORIGINS=["https://YOUR-VERCEL-APP.vercel.app"]
```

After the first deploy succeeds, run this once from a Railway shell:

```bash
alembic upgrade head
```

Optional data import after registering and logging in:

```text
POST /api/v1/admin/ingest/all?target_language=en
```

## 3. Vercel Frontend

Create a Vercel project from the same GitHub repo and set the root directory to:

```text
frontend
```

Set environment variables:

```env
NEXT_PUBLIC_API_URL=https://YOUR-RAILWAY-BACKEND.up.railway.app/api/v1
```

Deploy, then update Railway `CORS_ORIGINS` with the final Vercel URL and redeploy the backend.

## 4. Quick Checks

Backend:

```text
https://YOUR-RAILWAY-BACKEND.up.railway.app/api/v1/health
```

Frontend:

```text
https://YOUR-VERCEL-APP.vercel.app
```

Then test register, login, reading, Ask AI, and review.
