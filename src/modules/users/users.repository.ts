import { eq, sql, desc, asc } from 'drizzle-orm'
import { db, type Database } from '@/db'
import { users, type User, type NewUser } from './users.model'

export interface IUsersRepository {
    create(data: NewUser): Promise<User>
    findById(id: string): Promise<User | undefined>
    findByEmail(email: string): Promise<User | undefined>
    findAll(options: { page: number; limit: number }): Promise<{ data: User[]; total: number }>
    update(id: string, data: Partial<NewUser>): Promise<User | undefined>
    delete(id: string): Promise<boolean>
}

export class UsersRepository implements IUsersRepository {
    constructor(private readonly database: Database = db) { }

    async create(data: NewUser): Promise<User> {
        const [user] = await this.database.insert(users).values(data).returning()
        return user
    }

    async findById(id: string): Promise<User | undefined> {
        const [user] = await this.database
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1)
        return user
    }

    async findByEmail(email: string): Promise<User | undefined> {
        const [user] = await this.database
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)
        return user
    }

    async findAll(options: { page: number; limit: number }): Promise<{ data: User[]; total: number }> {
        const { page, limit } = options
        const offset = (page - 1) * limit

        const [data, countResult] = await Promise.all([
            this.database
                .select()
                .from(users)
                .orderBy(desc(users.createdAt))
                .limit(limit)
                .offset(offset),
            this.database
                .select({ count: sql<number>`count(*)::int` })
                .from(users),
        ])

        return {
            data,
            total: countResult[0]?.count || 0,
        }
    }

    async update(id: string, data: Partial<NewUser>): Promise<User | undefined> {
        const [user] = await this.database
            .update(users)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(users.id, id))
            .returning()
        return user
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.database
            .delete(users)
            .where(eq(users.id, id))
            .returning({ id: users.id })
        return result.length > 0
    }
}
