import { Elysia } from 'elysia'
import { config } from '@/config'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
}

interface LogEntry {
    timestamp: string
    level: LogLevel
    requestId: string
    method: string
    path: string
    status?: number
    latency?: number
    message: string
    error?: {
        name: string
        message: string
        stack?: string
    }
    [key: string]: unknown
}

function shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[config.logging.level]
}

function formatLog(entry: LogEntry): string {
    if (config.server.isProduction) {
        // Structured JSON logging for production
        return JSON.stringify(entry)
    } else {
        // Pretty logging for development
        const { timestamp, level, requestId, method, path, status, latency, message, error } = entry
        const latencyStr = latency !== undefined ? ` ${latency}ms` : ''
        const statusStr = status !== undefined ? ` ${status}` : ''
        const errorStr = error ? ` | Error: ${error.message}` : ''
        return `[${timestamp}] ${level.toUpperCase()} [${requestId.slice(0, 8)}] ${method} ${path}${statusStr}${latencyStr} - ${message}${errorStr}`
    }
}

function log(entry: LogEntry): void {
    if (!shouldLog(entry.level)) return

    const output = formatLog(entry)

    switch (entry.level) {
        case 'error':
            console.error(output)
            break
        case 'warn':
            console.warn(output)
            break
        case 'debug':
            console.debug(output)
            break
        default:
            console.log(output)
    }
}

export const loggerMiddleware = new Elysia({ name: 'logger' })
    .derive(({ store }) => {
        const startTime = Date.now()
            ; (store as Record<string, unknown>).startTime = startTime
        return {}
    })
    .onBeforeHandle(({ request, store }) => {
        const requestId = (store as Record<string, unknown>).requestId as string || 'unknown'
        const url = new URL(request.url)

        if (shouldLog('debug')) {
            log({
                timestamp: new Date().toISOString(),
                level: 'debug',
                requestId,
                method: request.method,
                path: url.pathname,
                message: 'Request received',
                query: Object.fromEntries(url.searchParams),
            })
        }
    })
    .onAfterHandle(({ request, store, set }) => {
        const requestId = (store as Record<string, unknown>).requestId as string || 'unknown'
        const startTime = (store as Record<string, unknown>).startTime as number
        const latency = Date.now() - startTime
        const url = new URL(request.url)

        log({
            timestamp: new Date().toISOString(),
            level: 'info',
            requestId,
            method: request.method,
            path: url.pathname,
            status: set.status as number || 200,
            latency,
            message: 'Request completed',
        })
    })
    .onError(({ request, error, store, set }) => {
        const requestId = (store as Record<string, unknown>).requestId as string || 'unknown'
        const startTime = (store as Record<string, unknown>).startTime as number
        const latency = startTime ? Date.now() - startTime : undefined
        const url = new URL(request.url)

        log({
            timestamp: new Date().toISOString(),
            level: 'error',
            requestId,
            method: request.method,
            path: url.pathname,
            status: set.status as number || 500,
            latency,
            message: 'Request failed',
            error: {
                name: error.name,
                message: error.message,
                stack: config.server.isDevelopment ? error.stack : undefined,
            },
        })
    })
    .as('global')

// Export logger utility for use elsewhere
export const logger = {
    debug: (message: string, meta?: Record<string, unknown>) => {
        if (shouldLog('debug')) {
            log({
                timestamp: new Date().toISOString(),
                level: 'debug',
                requestId: meta?.requestId as string || 'system',
                method: '-',
                path: '-',
                message,
                ...meta,
            })
        }
    },
    info: (message: string, meta?: Record<string, unknown>) => {
        if (shouldLog('info')) {
            log({
                timestamp: new Date().toISOString(),
                level: 'info',
                requestId: meta?.requestId as string || 'system',
                method: '-',
                path: '-',
                message,
                ...meta,
            })
        }
    },
    warn: (message: string, meta?: Record<string, unknown>) => {
        if (shouldLog('warn')) {
            log({
                timestamp: new Date().toISOString(),
                level: 'warn',
                requestId: meta?.requestId as string || 'system',
                method: '-',
                path: '-',
                message,
                ...meta,
            })
        }
    },
    error: (message: string, meta?: Record<string, unknown>) => {
        if (shouldLog('error')) {
            log({
                timestamp: new Date().toISOString(),
                level: 'error',
                requestId: meta?.requestId as string || 'system',
                method: '-',
                path: '-',
                message,
                ...meta,
            })
        }
    },
}
