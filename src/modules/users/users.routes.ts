import { Elysia } from 'elysia'
import { UsersController } from './users.controller'
import {
    createUserSchema,
    updateUserSchema,
    userIdParamSchema,
    paginationQuerySchema,
} from './users.schemas'

const controller = new UsersController()

export const usersRoutes = new Elysia({ prefix: '/users' })
    // POST /users - Create a new user
    .post(
        '/',
        async ({ body, store, set }) => {
            const requestId = (store as { requestId: string }).requestId
            const response = await controller.create(body, requestId)
            set.status = 201
            return response
        },
        {
            body: createUserSchema,
            detail: {
                summary: 'Create a new user',
                tags: ['Users'],
            },
        }
    )
    // GET /users - Get all users with pagination
    .get(
        '/',
        async ({ query, store }) => {
            const requestId = (store as { requestId: string }).requestId
            const page = query.page ?? 1
            const limit = query.limit ?? 10
            return controller.getAll({ page, limit }, requestId)
        },
        {
            query: paginationQuerySchema,
            detail: {
                summary: 'Get all users with pagination',
                tags: ['Users'],
            },
        }
    )
    // GET /users/:id - Get user by ID
    .get(
        '/:id',
        async ({ params, store }) => {
            const requestId = (store as { requestId: string }).requestId
            return controller.getById(params.id, requestId)
        },
        {
            params: userIdParamSchema,
            detail: {
                summary: 'Get user by ID',
                tags: ['Users'],
            },
        }
    )
    // PATCH /users/:id - Update user
    .patch(
        '/:id',
        async ({ params, body, store }) => {
            const requestId = (store as { requestId: string }).requestId
            return controller.update(params.id, body, requestId)
        },
        {
            params: userIdParamSchema,
            body: updateUserSchema,
            detail: {
                summary: 'Update user by ID',
                tags: ['Users'],
            },
        }
    )
    // DELETE /users/:id - Delete user
    .delete(
        '/:id',
        async ({ params, store }) => {
            const requestId = (store as { requestId: string }).requestId
            return controller.delete(params.id, requestId)
        },
        {
            params: userIdParamSchema,
            detail: {
                summary: 'Delete user by ID',
                tags: ['Users'],
            },
        }
    )
