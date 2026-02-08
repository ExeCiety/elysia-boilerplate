import { app } from './app'
import { config } from '@/config'
import { pool } from '@/db'
import { logger } from '@/middlewares/logger'

// Track server state
let isShuttingDown = false

// Start the server
const server = app.listen({
    port: config.server.port,
    hostname: config.server.host,
})

logger.info(`🦊 ElysiaJS server started`, {
    port: config.server.port,
    host: config.server.host,
    environment: config.server.nodeEnv,
    url: `http://${config.server.host}:${config.server.port}`,
})

// Graceful shutdown handler
async function gracefulShutdown(signal: string) {
    if (isShuttingDown) {
        logger.warn('Shutdown already in progress...')
        return
    }

    isShuttingDown = true
    logger.info(`Received ${signal}. Starting graceful shutdown...`)

    try {
        // Stop accepting new connections
        logger.info('Closing HTTP server...')
        server.stop()

        // Close database connections
        logger.info('Closing database connections...')
        await pool.end()

        logger.info('Graceful shutdown completed.')
        process.exit(0)
    } catch (error) {
        logger.error('Error during shutdown:', { error })
        process.exit(1)
    }
}

// Register shutdown handlers
process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', { error: error.message, stack: error.stack })
    gracefulShutdown('uncaughtException')
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection:', { reason, promise: String(promise) })
    gracefulShutdown('unhandledRejection')
})

export { server }
