import { Elysia } from 'elysia'
import { config } from '@/config'
import {
    corsMiddleware,
    rateLimitMiddleware,
    secureHeadersMiddleware,
    requestIdMiddleware,
    loggerMiddleware,
} from '@/middlewares'
import {
    AppError,
    ValidationError,
    NotFoundError,
    formatErrorResponse
} from '@/utils/errors'

// Routes
import { healthRoutes } from '@/modules/health/health.routes'
import { usersRoutes } from '@/modules/users/users.routes'

// Create Elysia app instance
export const app = new Elysia()
    // Apply middlewares in order
    .use(requestIdMiddleware)    // Generate request ID first
    .use(corsMiddleware)         // Handle CORS
    .use(secureHeadersMiddleware) // Add security headers
    .use(rateLimitMiddleware)    // Apply rate limiting
    .use(loggerMiddleware)       // Log requests

    // Global error handler
    .onError(({ error, set, store }) => {
        const requestId = (store as { requestId?: string }).requestId || 'unknown'

        // Handle Elysia validation errors
        if (error.name === 'VALIDATION' || error.code === 'VALIDATION') {
            set.status = 400
            return formatErrorResponse(
                new ValidationError('Validation failed', 'VALIDATION_ERROR', {
                    message: error.message,
                }),
                requestId
            )
        }

        // Handle our custom AppError
        if (error instanceof AppError) {
            set.status = error.statusCode
            return formatErrorResponse(error, requestId)
        }

        // Handle Elysia NOT_FOUND error
        if ((error as { code?: string }).code === 'NOT_FOUND') {
            set.status = 404
            return formatErrorResponse(
                new NotFoundError('Route not found'),
                requestId
            )
        }

        // Handle unknown errors
        console.error('Unhandled error:', error)
        set.status = 500
        return formatErrorResponse(
            new Error('Internal server error'),
            requestId
        )
    })

    // Register routes
    .use(healthRoutes)
    .use(usersRoutes)

    // Root endpoint
    .get('/', ({ store }) => {
        const requestId = (store as { requestId: string }).requestId
        return {
            success: true,
            data: {
                name: 'ElysiaJS Boilerplate API',
                version: '1.0.0',
                documentation: '/swagger',
            },
            requestId,
        }
    })

// Export app type for client inference
export type App = typeof app
