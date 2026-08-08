from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.config import get_settings
from app.middleware import ErrorHandlingMiddleware
from app.routers import auth, users, materials, knowledge_points, progress, generate, ask, admin, dictionary


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    yield
    # Shutdown


app = FastAPI(
    title="Language Learning Agent",
    description="中文母语者学习英语 + 日语 | English + Japanese Learning Platform",
    version="0.1.0",
    lifespan=lifespan,
)

# Error handling (must be added before other middleware)
app.add_middleware(ErrorHandlingMiddleware)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# CORS
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["认证"])
app.include_router(users.router, prefix="/api/v1/users", tags=["用户"])
app.include_router(materials.router, prefix="/api/v1/materials", tags=["学习材料"])
app.include_router(knowledge_points.router, prefix="/api/v1/knowledge-points", tags=["知识点"])
app.include_router(progress.router, prefix="/api/v1/progress", tags=["学习进度"])
app.include_router(generate.router, prefix="/api/v1/generate", tags=["AI生成"])
app.include_router(ask.router, prefix="/api/v1/ask", tags=["AI问答"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["管理"])
app.include_router(dictionary.router, prefix="/api/v1/dictionary", tags=["dictionary"])


@app.get("/api/v1/health")
async def health_check():
    return {"status": "ok", "service": "language-learning-agent"}
