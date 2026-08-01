from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql+asyncpg://langlearn:changeme@localhost:5432/langlearn"
    sync_database_url: str = "postgresql://langlearn:changeme@localhost:5432/langlearn"

    # Redis
    redis_url: str = "redis://localhost:6379"

    # JWT
    jwt_secret: str = "changeme-jwt-secret"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60

    # OpenAI
    openai_api_key: str = ""
    openai_embedding_model: str = "text-embedding-3-small"
    openai_chat_model: str = "gpt-4o-mini"
    openai_max_tokens: int = 4096

    # App
    debug: bool = False
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
