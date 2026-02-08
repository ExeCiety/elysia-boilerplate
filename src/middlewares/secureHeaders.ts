import { Elysia } from 'elysia'
import { config } from '@/config'

export const secureHeadersMiddleware = new Elysia({ name: 'secureHeaders' })
    .onAfterHandle(({ set }) => {
        // Prevent MIME type sniffing
        set.headers['X-Content-Type-Options'] = 'nosniff'

        // Prevent clickjacking
        set.headers['X-Frame-Options'] = 'DENY'

        // Control referrer information
        set.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'

        // Restrict browser features
        set.headers['Permissions-Policy'] =
            'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'

        // Content Security Policy - restrictive for API
        set.headers['Content-Security-Policy'] =
            "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"

        // Prevent XSS attacks
        set.headers['X-XSS-Protection'] = '1; mode=block'

        // HSTS - only in production over HTTPS
        if (config.server.isProduction) {
            set.headers['Strict-Transport-Security'] =
                'max-age=31536000; includeSubDomains; preload'
        }

        // Prevent caching of sensitive data
        set.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate'
        set.headers['Pragma'] = 'no-cache'
        set.headers['Expires'] = '0'
    })
