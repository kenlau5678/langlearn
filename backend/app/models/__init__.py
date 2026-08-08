from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Import all models so Base.metadata is populated
from app.models.user import User, UserLanguageProfile  # noqa: E402, F401
from app.models.knowledge_point import KnowledgePoint  # noqa: E402, F401
from app.models.user_progress import UserProgress, ReviewLog  # noqa: E402, F401
