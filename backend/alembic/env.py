from logging.config import fileConfig
import os
import sys
from pathlib import Path
from sqlalchemy import engine_from_config, pool
from alembic import context

sys.path.append(str(Path(__file__).resolve().parents[1]))

# Import all models so Alembic can detect them
from app.models import Base
from app.models.user import User, UserLanguageProfile
from app.models.knowledge_point import KnowledgePoint, Material, MaterialChunk, MaterialKnowledgePoint
from app.models.user_progress import UserProgress, ReviewLog

config = context.config
database_url = os.getenv("SYNC_DATABASE_URL") or os.getenv("DATABASE_URL")
if database_url:
    config.set_main_option(
        "sqlalchemy.url",
        database_url.replace("postgresql+asyncpg://", "postgresql://"),
    )

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
