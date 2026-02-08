import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from '@/config'
import * as usersSchema from '@/modules/users/users.model'

// Create postgres connection
// Note: For production, postgres.js handles connection pooling internally
const queryClient = postgres(config.database.url, {
    max: 10, // Maximum connections in pool
    idle_timeout: 20, // Close idle connections after 20 seconds
    connect_timeout: 10, // Timeout for initial connection
})

// Create drizzle instance with schema
export const db = drizzle(queryClient, {
    schema: {
        ...usersSchema,
    },
})

// Export pool for graceful shutdown
export const pool = queryClient

// Type for db instance
export type Database = typeof db
