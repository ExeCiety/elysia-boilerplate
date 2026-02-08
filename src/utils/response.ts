// Success response interface
export interface SuccessResponse<T = unknown> {
    success: true
    data: T
    requestId: string
}

// Paginated response interface
export interface PaginatedResponse<T = unknown> {
    success: true
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
    requestId: string
}

// Create success response
export function successResponse<T>(
    data: T,
    requestId: string,
    _statusCode = 200
): SuccessResponse<T> {
    return {
        success: true,
        data,
        requestId,
    }
}

// Create paginated response
export function paginatedResponse<T>(
    data: T[],
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    },
    requestId: string
): PaginatedResponse<T> {
    return {
        success: true,
        data,
        pagination,
        requestId,
    }
}
