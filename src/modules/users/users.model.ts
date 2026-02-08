import { pgTable, uuid, varchar, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const users = pgTable(
    'users',
    {
        id: uuid('id')
            .primaryKey()
            .default(sql`gen_random_uuid()`),
        name: varchar('name', { length: 255 }).notNull(),
        email: varchar('email', { length: 255 }).notNull(),
        createdAt: timestamp('created_at', { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .defaultNow()
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        uniqueIndex('users_email_unique_idx').on(table.email),
        index('users_created_at_idx').on(table.createdAt),
    ]
)

// Type inference
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
