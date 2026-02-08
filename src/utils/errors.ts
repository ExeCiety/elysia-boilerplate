// Base application error class
export class AppError extends Error {
    public readonly code: string
    public readonly statusCode: number
    public readonly details?: Record<string, unknown>

    constructor(
        message: string,
        code: string,
        statusCode: number,
        details?: Record<string, unknown>
    ) {
        super(message)
        this.name = this.constructor.name
        this.code = code
        this.statusCode = statusCode
        this.details = details
        Error.captureStackTrace(this, this.constructor)
    }
}

// 400 Bad Request
export class ValidationError extends AppError {
    constructor(message: string, code = 'VALIDATION_ERROR', details?: Record<string, unknown>) {
        super(message, code, 400, details)
    }
}

// 401 Unauthorized
export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized', code = 'UNAUTHORIZED', details?: Record<string, unknown>) {
        super(message, code, 401, details)
    }
}

// 403 Forbidden
export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden', code = 'FORBIDDEN', details?: Record<string, unknown>) {
        super(message, code, 403, details)
    }
}

// 404 Not Found
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found', code = 'NOT_FOUND', details?: Record<string, unknown>) {
        super(message, code, 404, details)
    }
}

// 409 Conflict
export class ConflictError extends AppError {
    constructor(message: string, code = 'CONFLICT', details?: Record<string, unknown>) {
        super(message, code, 409, details)
    }
}

// 429 Too Many Requests
export class TooManyRequestsError extends AppError {
    constructor(message = 'Too many requests', code = 'TOO_MANY_REQUESTS', details?: Record<string, unknown>) {
        super(message, code, 429, details)
    }
}

// 500 Internal Server Error
export class InternalError extends AppError {
    constructor(message = 'Internal server error', code = 'INTERNAL_ERROR', details?: Record<string, unknown>) {
        super(message, code, 500, details)
    }
}

// Error response interface
export interface ErrorResponse {
    success: false
    error: {
        code: string
        message: string
        details?: Record<string, unknown>
    }
    requestId: string
}

// Format error to response
export function formatErrorResponse(
    error: AppError | Error,
    requestId: string
): ErrorResponse {
    if (error instanceof AppError) {
        return {
            success: false,
            error: {
                code: error.code,
                message: error.message,
                details: error.details,
            },
            requestId,
        }
    }

    // Generic error
    return {
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred',
        },
        requestId,
    }
}
