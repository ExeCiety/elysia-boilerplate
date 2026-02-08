import { t } from 'elysia'

// Email regex pattern
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Create user schema
export const createUserSchema = t.Object({
    name: t.String({ minLength: 2, maxLength: 255, error: 'Name must be between 2 and 255 characters' }),
    email: t.String({
        format: 'email',
        maxLength: 255,
        error: 'Invalid email format'
    }),
})

// Update user schema (partial)
export const updateUserSchema = t.Object({
    name: t.Optional(t.String({ minLength: 2, maxLength: 255, error: 'Name must be between 2 and 255 characters' })),
    email: t.Optional(t.String({
        format: 'email',
        maxLength: 255,
        error: 'Invalid email format'
    })),
})

// User ID param schema
export const userIdParamSchema = t.Object({
    id: t.String({ format: 'uuid', error: 'Invalid user ID format' }),
})

// Pagination query schema
export const paginationQuerySchema = t.Object({
    page: t.Optional(t.Numeric({ minimum: 1, default: 1, error: 'Page must be a positive number' })),
    limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 10, error: 'Limit must be between 1 and 100' })),
})

// Types
export type CreateUserInput = typeof createUserSchema.static
export type UpdateUserInput = typeof updateUserSchema.static
export type UserIdParam = typeof userIdParamSchema.static
export type PaginationQuery = typeof paginationQuerySchema.static
