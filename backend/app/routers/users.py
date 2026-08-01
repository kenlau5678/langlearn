from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User, UserLanguageProfile
from app.schemas.user import (
    UserResponse, UserUpdate,
    LanguageProfileCreate, LanguageProfileUpdate, LanguageProfileResponse,
)
from app.services.auth_service import get_current_user
from app.middleware import NotFoundError, ConflictError

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserResponse)
async def update_me(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if data.display_name is not None:
        current_user.display_name = data.display_name
    if data.daily_goal is not None:
        current_user.daily_goal = data.daily_goal
    if data.preferences is not None:
        current_user.preferences = data.preferences
    await db.flush()
    await db.refresh(current_user)
    return current_user


# --- Language Profiles ---

@router.get("/me/language-profiles", response_model=list[LanguageProfileResponse])
async def list_profiles(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(UserLanguageProfile).where(UserLanguageProfile.user_id == current_user.id)
    )
    return result.scalars().all()


@router.post("/me/language-profiles", response_model=LanguageProfileResponse, status_code=201)
async def create_profile(
    data: LanguageProfileCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Check for duplicate language
    existing = await db.execute(
        select(UserLanguageProfile).where(
            UserLanguageProfile.user_id == current_user.id,
            UserLanguageProfile.target_language == data.target_language,
        )
    )
    if existing.scalar_one_or_none():
        raise ConflictError(f"语言 '{data.target_language}' 的学习计划已存在")

    profile = UserLanguageProfile(
        user_id=current_user.id,
        target_language=data.target_language,
        current_level=data.current_level,
        target_level=data.target_level,
        level_system=data.level_system,
        daily_goal=data.daily_goal,
    )
    db.add(profile)
    await db.flush()
    await db.refresh(profile)
    return profile


@router.patch("/me/language-profiles/{lang}", response_model=LanguageProfileResponse)
async def update_profile(
    lang: str,
    data: LanguageProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(UserLanguageProfile).where(
            UserLanguageProfile.user_id == current_user.id,
            UserLanguageProfile.target_language == lang,
        )
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise NotFoundError("language profile", lang)

    if data.current_level is not None:
        profile.current_level = data.current_level
    if data.target_level is not None:
        profile.target_level = data.target_level
    if data.daily_goal is not None:
        profile.daily_goal = data.daily_goal
    await db.flush()
    await db.refresh(profile)
    return profile
