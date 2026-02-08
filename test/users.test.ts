import { describe, expect, it, beforeAll, afterAll } from 'bun:test'
import { app } from '../src/app'
import { db } from '../src/db'
import { users } from '../src/modules/users/users.model'
import { eq } from 'drizzle-orm'

// Test data
const uniqueSuffix = Date.now()
const testUser = {
    name: `Test User ${uniqueSuffix}`,
    email: `test${uniqueSuffix}@example.com`
}

describe('Users Module', () => {
    let createdUserId: string

    it('POST /users should create a new user', async () => {
        const response = await app.handle(
            new Request('http://localhost/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testUser)
            })
        )

        expect(response.status).toBe(201)
        const json = await response.json()
        expect(json.success).toBe(true)
        expect(json.data.name).toBe(testUser.name)
        expect(json.data.email).toBe(testUser.email)
        expect(json.data.id).toBeDefined()

        createdUserId = json.data.id
    })

    it('GET /users should return list of users', async () => {
        const response = await app.handle(new Request('http://localhost/users'))
        expect(response.status).toBe(200)

        const json = await response.json()
        expect(json.success).toBe(true)
        expect(Array.isArray(json.data)).toBe(true)
        expect(json.pagination).toBeDefined()
    })

    it('GET /users/:id should return the created user', async () => {
        const response = await app.handle(new Request(`http://localhost/users/${createdUserId}`))
        expect(response.status).toBe(200)

        const json = await response.json()
        expect(json.success).toBe(true)
        expect(json.data.id).toBe(createdUserId)
    })

    it('PATCH /users/:id should update user details', async () => {
        const updatedName = `Updated Name ${uniqueSuffix}`
        const response = await app.handle(
            new Request(`http://localhost/users/${createdUserId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: updatedName })
            })
        )

        expect(response.status).toBe(200)
        const json = await response.json()
        expect(json.success).toBe(true)
        expect(json.data.name).toBe(updatedName)
    })

    it('DELETE /users/:id should delete the user', async () => {
        const response = await app.handle(
            new Request(`http://localhost/users/${createdUserId}`, {
                method: 'DELETE'
            })
        )

        expect(response.status).toBe(200)
        const json = await response.json()
        expect(json.success).toBe(true)
        expect(json.data.deleted).toBe(true)
    })

    it('GET /users/:id should return 404 for deleted user', async () => {
        const response = await app.handle(new Request(`http://localhost/users/${createdUserId}`))
        expect(response.status).toBe(404)
    })

    // Cleanup using direct DB access if needed, though DELETE test should handle it
    afterAll(async () => {
        if (createdUserId) {
            try {
                await db.delete(users).where(eq(users.id, createdUserId))
            } catch (e) {
                // Ignore if already deleted
            }
        }
    })
})
