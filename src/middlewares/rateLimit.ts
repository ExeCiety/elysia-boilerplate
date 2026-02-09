import { Elysia } from 'elysia'
import { config } from '@/config'
import { TooManyRequestsError } from '@/utils/errors'

interface RateLimitEntry {
    count: number
    resetTime: number
}

// In-memory store for rate limiting
// For production with multiple instances, use Redis or similar
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetTime < now) {
            rateLimitStore.delete(key)
        }
    }
}, 60000) // Cleanup every minute

function getClientIp(headers: Record<string, string | undefined>): string {
    // Check common headers for client IP (when behind a proxy)
    const forwardedFor = headers['x-forwarded-for']
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim()
    }

    const realIp = headers['x-real-ip']
    if (realIp) {
        return realIp
    }

    // Fallback: use a default value for local development
    return '127.0.0.1'
}

export const rateLimitMiddleware = new Elysia({ name: 'rateLimit' })
    .derive(({ headers }) => {
        const clientIp = getClientIp(headers)
        return { clientIp }
    })
    .onBeforeHandle(({ clientIp, store }) => {
        const { max, windowMs } = config.rateLimit

        if (max === 0) {
            return
        }

        const now = Date.now()
        const key = clientIp

        let entry = rateLimitStore.get(key)

        if (!entry || entry.resetTime < now) {
            // Create new entry or reset expired one
            entry = {
                count: 1,
                resetTime: now + windowMs,
            }
            rateLimitStore.set(key, entry)
        } else {
            entry.count++

            if (entry.count > max) {
                const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
                throw new TooManyRequestsError(
                    `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
                    'RATE_LIMIT_EXCEEDED',
                    { retryAfter }
                )
            }
        }

        // Add rate limit headers to store for later use
        ; (store as Record<string, unknown>).rateLimitRemaining = max - entry.count
            ; (store as Record<string, unknown>).rateLimitReset = entry.resetTime
    })
    .onAfterHandle(({ store, set }) => {
        const { max } = config.rateLimit

        if (max === 0) {
            return
        }

        const remaining = (store as Record<string, unknown>).rateLimitRemaining as number
        const reset = (store as Record<string, unknown>).rateLimitReset as number

        set.headers['X-RateLimit-Limit'] = String(max)
        set.headers['X-RateLimit-Remaining'] = String(Math.max(0, remaining))
        set.headers['X-RateLimit-Reset'] = String(Math.ceil(reset / 1000))
    })
    .as('global')
