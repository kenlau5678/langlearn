from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, EmailStr


# --- User ---
class UserCreate(BaseModel):
    email: EmailStr
    display_name: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: UUID
    email: str
    display_name: str
    native_language: str
    daily_goal: int
    preferences: dict
    streak_days: int
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    display_name: str | None = None
    daily_goal: int | None = None
    preferences: dict | None = None


# --- Token ---
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    refresh_token: str


# --- Language Profile ---
class LanguageProfileCreate(BaseModel):
    target_language: str  # 'en' or 'ja'
    current_level: str    # 'N5', '4.0', etc.
    target_level: str
    level_system: str     # 'jlpt', 'ielts', 'cefr'
    daily_goal: int = 20


class LanguageProfileUpdate(BaseModel):
    current_level: str | None = None
    target_level: str | None = None
    daily_goal: int | None = None


class LanguageProfileResponse(BaseModel):
    id: UUID
    target_language: str
    current_level: str
    target_level: str
    level_system: str
    daily_goal: int
    streak_days: int
    created_at: datetime

    model_config = {"from_attributes": True}
