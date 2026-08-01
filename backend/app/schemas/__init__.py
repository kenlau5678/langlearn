from pydantic import BaseModel


class PaginationParams(BaseModel):
    page: int = 1
    page_size: int = 20


class PaginatedMeta(BaseModel):
    page: int
    page_size: int
    total: int
    total_pages: int


class PaginatedResponse(BaseModel):
    data: list
    meta: PaginatedMeta


class APIError(BaseModel):
    code: str
    message: str
    details: dict | None = None


class ErrorResponse(BaseModel):
    error: APIError
