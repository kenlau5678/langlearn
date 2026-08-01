"""Error handling middleware and custom exceptions."""

import logging
from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)


# Custom exception classes
class AppError(Exception):
    """Base application error."""
    status_code = 500
    error_code = "INTERNAL_ERROR"

    def __init__(self, message: str, details=None):
        self.message = message
        self.details = details
        super().__init__(message)


class NotFoundError(AppError):
    status_code = 404
    error_code = "NOT_FOUND"


class ConflictError(AppError):
    status_code = 409
    error_code = "CONFLICT"


class UnauthorizedError(AppError):
    status_code = 401
    error_code = "UNAUTHORIZED"


class ForbiddenError(AppError):
    status_code = 403
    error_code = "FORBIDDEN"


class ValidationError(AppError):
    status_code = 422
    error_code = "VALIDATION_ERROR"


class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except AppError as exc:
            logger.warning(f"AppError on {request.method} {request.url.path}: {exc.error_code} {exc.message}")
            return JSONResponse(
                status_code=exc.status_code,
                content={"error": {"code": exc.error_code, "message": exc.message, "details": exc.details}},
            )
        except Exception as exc:
            logger.exception(f"Unhandled error on {request.method} {request.url.path}")
            return JSONResponse(
                status_code=500,
                content={"error": {"code": "INTERNAL_ERROR", "message": str(exc), "details": None}},
            )
