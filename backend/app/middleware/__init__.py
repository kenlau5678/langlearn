from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class APIError(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400, details: Optional[dict] = None):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(message)


class NotFoundError(APIError):
    def __init__(self, resource: str, identifier: str):
        super().__init__(
            code=f"{resource.upper()}_NOT_FOUND",
            message=f"{resource} '{identifier}' not found",
            status_code=404,
        )


class ConflictError(APIError):
    def __init__(self, message: str):
        super().__init__(code="CONFLICT", message=message, status_code=409)


class UnauthorizedError(APIError):
    def __init__(self, message: str = "未授权"):
        super().__init__(code="UNAUTHORIZED", message=message, status_code=401)


class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            return await call_next(request)
        except APIError as exc:
            return JSONResponse(
                status_code=exc.status_code,
                content={"error": {"code": exc.code, "message": exc.message, "details": exc.details}},
            )
        except Exception as exc:
            logger.exception("Unhandled exception")
            return JSONResponse(
                status_code=500,
                content={"error": {"code": "INTERNAL_ERROR", "message": "服务器内部错误", "details": None}},
            )
