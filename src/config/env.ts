import { t } from 'elysia'

// Environment schema with defaults
const envSchema = {
    // Server
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    HOST: process.env.HOST || '0.0.0.0',

    // Database
    DATABASE_URL: process.env.DATABASE_URL || '',

    // CORS
    CORS_ORIGINS: process.env.CORS_ORIGINS || '*',
    CORS_METHODS: process.env.CORS_METHODS || 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    CORS_HEADERS: process.env.CORS_HEADERS || 'Content-Type,Authorization',
    CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',

    // Rate Limiting
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),

    // Logging
    LOG_LEVEL: (process.env.LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
}

// Validate required env vars
function validateEnv() {
    const required = ['DATABASE_URL']
    const missing = required.filter((key) => !process.env[key])

    if (missing.length > 0 && envSchema.NODE_ENV !== 'test') {
        console.error(`Missing required environment variables: ${missing.join(', ')}`)
        if (envSchema.NODE_ENV === 'production') {
            process.exit(1)
        }
    }
}

validateEnv()

export const config = {
    server: {
        nodeEnv: envSchema.NODE_ENV,
        port: envSchema.PORT,
        host: envSchema.HOST,
        isProduction: envSchema.NODE_ENV === 'production',
        isDevelopment: envSchema.NODE_ENV === 'development',
    },
    database: {
        url: envSchema.DATABASE_URL,
    },
    cors: {
        origins: envSchema.CORS_ORIGINS.split(',').map((o) => o.trim()),
        methods: envSchema.CORS_METHODS.split(',').map((m) => m.trim()),
        headers: envSchema.CORS_HEADERS.split(',').map((h) => h.trim()),
        credentials: envSchema.CORS_CREDENTIALS,
    },
    rateLimit: {
        max: envSchema.RATE_LIMIT_MAX,
        windowMs: envSchema.RATE_LIMIT_WINDOW_MS,
    },
    logging: {
        level: envSchema.LOG_LEVEL,
    },
} as const

export type Config = typeof config
