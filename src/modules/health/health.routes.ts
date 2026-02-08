import { Elysia } from 'elysia'
import { sql } from 'drizzle-orm'
import { db } from '@/db'
import { successResponse } from '@/utils/response'

export const healthRoutes = new Elysia({ prefix: '/health' })
    // GET /health - Basic health check
    .get('/', ({ store }) => {
        const requestId = (store as { requestId: string }).requestId
        return successResponse(
            {
                status: 'ok',
                timestamp: new Date().toISOString(),
            },
            requestId
        )
    })
    // GET /health/db - Database health check
    .get('/db', async ({ store }) => {
        const requestId = (store as { requestId: string }).requestId

        try {
            // Simple query to test database connection
            const result = await db.execute(sql`SELECT 1 as check`)

            return successResponse(
                {
                    status: 'ok',
                    database: 'connected',
                    timestamp: new Date().toISOString(),
                },
                requestId
            )
        } catch (error) {
            return {
                success: false,
                error: {
                    code: 'DATABASE_ERROR',
                    message: 'Database connection failed',
                },
                requestId,
            }
        }
    })
