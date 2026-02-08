import { UsersService, type IUsersService } from './users.service'
import type { CreateUserInput, UpdateUserInput } from './users.schemas'
import { successResponse, paginatedResponse } from '@/utils/response'

export interface IUsersController {
    create(data: CreateUserInput, requestId: string): Promise<ReturnType<typeof successResponse>>
    getById(id: string, requestId: string): Promise<ReturnType<typeof successResponse>>
    getAll(options: { page: number; limit: number }, requestId: string): Promise<ReturnType<typeof paginatedResponse>>
    update(id: string, data: UpdateUserInput, requestId: string): Promise<ReturnType<typeof successResponse>>
    delete(id: string, requestId: string): Promise<ReturnType<typeof successResponse>>
}

export class UsersController implements IUsersController {
    constructor(private readonly service: IUsersService = new UsersService()) { }

    async create(data: CreateUserInput, requestId: string) {
        const user = await this.service.createUser(data)
        return successResponse(user, requestId, 201)
    }

    async getById(id: string, requestId: string) {
        const user = await this.service.getUserById(id)
        return successResponse(user, requestId)
    }

    async getAll(options: { page: number; limit: number }, requestId: string) {
        const result = await this.service.getAllUsers(options)
        return paginatedResponse(result.data, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
        }, requestId)
    }

    async update(id: string, data: UpdateUserInput, requestId: string) {
        const user = await this.service.updateUser(id, data)
        return successResponse(user, requestId)
    }

    async delete(id: string, requestId: string) {
        await this.service.deleteUser(id)
        return successResponse({ deleted: true }, requestId)
    }
}
