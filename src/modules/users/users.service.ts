import { UsersRepository, type IUsersRepository } from './users.repository'
import type { User } from './users.model'
import type { CreateUserInput, UpdateUserInput } from './users.schemas'
import { NotFoundError, ConflictError } from '@/utils/errors'

export interface IUsersService {
    createUser(data: CreateUserInput): Promise<User>
    getUserById(id: string): Promise<User>
    getAllUsers(options: { page: number; limit: number }): Promise<{ data: User[]; total: number; page: number; limit: number; totalPages: number }>
    updateUser(id: string, data: UpdateUserInput): Promise<User>
    deleteUser(id: string): Promise<void>
}

export class UsersService implements IUsersService {
    constructor(private readonly repository: IUsersRepository = new UsersRepository()) { }

    async createUser(data: CreateUserInput): Promise<User> {
        // Check if email already exists
        const existingUser = await this.repository.findByEmail(data.email)
        if (existingUser) {
            throw new ConflictError('User with this email already exists', 'EMAIL_EXISTS')
        }

        return this.repository.create(data)
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.repository.findById(id)
        if (!user) {
            throw new NotFoundError('User not found', 'USER_NOT_FOUND')
        }
        return user
    }

    async getAllUsers(options: { page: number; limit: number }): Promise<{
        data: User[]
        total: number
        page: number
        limit: number
        totalPages: number
    }> {
        const { page, limit } = options
        const result = await this.repository.findAll({ page, limit })

        return {
            ...result,
            page,
            limit,
            totalPages: Math.ceil(result.total / limit),
        }
    }

    async updateUser(id: string, data: UpdateUserInput): Promise<User> {
        // Check if user exists
        const existingUser = await this.repository.findById(id)
        if (!existingUser) {
            throw new NotFoundError('User not found', 'USER_NOT_FOUND')
        }

        // If email is being updated, check for conflicts
        if (data.email && data.email !== existingUser.email) {
            const emailExists = await this.repository.findByEmail(data.email)
            if (emailExists) {
                throw new ConflictError('User with this email already exists', 'EMAIL_EXISTS')
            }
        }

        const updatedUser = await this.repository.update(id, data)
        if (!updatedUser) {
            throw new NotFoundError('User not found', 'USER_NOT_FOUND')
        }

        return updatedUser
    }

    async deleteUser(id: string): Promise<void> {
        const deleted = await this.repository.delete(id)
        if (!deleted) {
            throw new NotFoundError('User not found', 'USER_NOT_FOUND')
        }
    }
}
