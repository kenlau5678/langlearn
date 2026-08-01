import math
from typing import TypeVar, Generic
from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas import PaginatedMeta, PaginatedResponse

T = TypeVar("T")


def apply_pagination(stmt: Select, page: int = 1, page_size: int = 20) -> Select:
    """Apply offset/limit pagination to a SQLAlchemy statement."""
    page = max(1, page)
    page_size = min(max(1, page_size), 100)
    offset = (page - 1) * page_size
    return stmt.offset(offset).limit(page_size)


async def paginated_query(
    db: AsyncSession,
    stmt: Select,
    count_stmt: Select,
    page: int = 1,
    page_size: int = 20,
) -> PaginatedResponse:
    """Execute a paginated query and return standard paginated response."""
    page = max(1, page)
    page_size = min(max(1, page_size), 100)

    # Get total count
    count_result = await db.execute(count_stmt)
    total = count_result.scalar() or 0
    total_pages = math.ceil(total / page_size) if total > 0 else 0

    # Get page data
    paginated = apply_pagination(stmt, page, page_size)
    result = await db.execute(paginated)
    rows = result.scalars().all()

    return PaginatedResponse(
        data=list(rows),
        meta=PaginatedMeta(
            page=page,
            page_size=page_size,
            total=total,
            total_pages=total_pages,
        ),
    )
