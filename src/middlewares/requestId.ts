import { Elysia } from 'elysia'

function generateRequestId(): string {
    // Use crypto.randomUUID() for generating UUIDs
    return crypto.randomUUID()
}

export const requestIdMiddleware = new Elysia({ name: 'requestId' })
    .derive(({ headers, store }) => {
        // Check for existing request ID in headers (useful for distributed tracing)
        const existingId = headers['x-request-id']
        const requestId = existingId || generateRequestId()

            // Store request ID for later use
            ; (store as Record<string, unknown>).requestId = requestId

        return { requestId }
    })
    .onAfterHandle(({ store, set }) => {
        // Add request ID to response headers
        const requestId = (store as Record<string, unknown>).requestId as string
        set.headers['X-Request-Id'] = requestId
    })
