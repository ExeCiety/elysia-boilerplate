export interface PaginationParams {
    page: number
    limit: number
}

export interface PaginationMeta {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

export function parsePaginationParams(
    query: { page?: number; limit?: number },
    defaults: { page: number; limit: number } = { page: 1, limit: 10 }
): PaginationParams {
    return {
        page: Math.max(1, query.page || defaults.page),
        limit: Math.min(100, Math.max(1, query.limit || defaults.limit)),
    }
}

export function calculatePaginationMeta(
    total: number,
    params: PaginationParams
): PaginationMeta {
    const totalPages = Math.ceil(total / params.limit)

    return {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPrevPage: params.page > 1,
    }
}

export function calculateOffset(params: PaginationParams): number {
    return (params.page - 1) * params.limit
}
