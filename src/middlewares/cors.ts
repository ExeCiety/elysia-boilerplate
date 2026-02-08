import { Elysia } from 'elysia'
import cors from '@elysiajs/cors'
import { config } from '@/config'

export const corsMiddleware = new Elysia({ name: 'cors' }).use(
    cors({
        origin: config.cors.origins.includes('*')
            ? true
            : config.cors.origins,
        methods: config.cors.methods as ('GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS')[],
        allowedHeaders: config.cors.headers,
        credentials: config.cors.credentials,
        maxAge: 86400, // 24 hours
    })
)
