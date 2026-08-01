from pydantic import field_validator
from pydantic_settings import BaseSettings
from functools import lru_cache
import json


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

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value):
        if isinstance(value, str):
            text = value.strip()
            if not text:
                return []
            if text.startswith("["):
                return json.loads(text)
            return [origin.strip() for origin in text.split(",") if origin.strip()]
        return value

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


@lru_cache
def get_settings() -> Settings:
    return Settings()
