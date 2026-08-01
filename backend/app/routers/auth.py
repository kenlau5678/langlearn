from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.schemas.user import (
    UserCreate, UserLogin, UserResponse,
    TokenResponse, TokenRefresh,
)
from app.services.auth_service import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token,
)
from app.middleware import ConflictError, UnauthorizedError

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check existing user
    existing = await db.execute(select(User).where(User.email == data.email))
    if existing.scalar_one_or_none():
        raise ConflictError("该邮箱已被注册")

    user = User(
        email=data.email,
        display_name=data.display_name,
        hashed_password=hash_password(data.password),
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email, User.deleted_at.is_(None)))
    user = result.scalar_one_or_none()
    if not user or not verify_password(data.password, user.hashed_password):
        raise UnauthorizedError("邮箱或密码错误")

    return TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(data: TokenRefresh, db: AsyncSession = Depends(get_db)):
    payload = decode_token(data.refresh_token)
    if payload.get("type") != "refresh":
        raise UnauthorizedError("无效的刷新令牌")

    from uuid import UUID
    result = await db.execute(select(User).where(User.id == UUID(payload["sub"]), User.deleted_at.is_(None)))
    user = result.scalar_one_or_none()
    if not user:
        raise UnauthorizedError("用户不存在")

    return TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )
