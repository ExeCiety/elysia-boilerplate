import { describe, expect, it } from 'bun:test'
import { app } from '../src/app'

describe('Health Module', () => {
    it('GET /health should return 200 OK', async () => {
        const response = await app.handle(new Request('http://localhost/health'))
        expect(response.status).toBe(200)

        const json = await response.json()
        expect(json.success).toBe(true)
        expect(json.data.status).toBe('ok')
        expect(json.data.timestamp).toBeDefined()
    })

    it('GET /health/db should return database status', async () => {
        const response = await app.handle(new Request('http://localhost/health/db'))
        // Note: This might fail if DB is not reachable during test, 
        // but it tests the route existence and structure
        expect(response.status).toBe(200)

        const json = await response.json()
        if (json.success) {
            expect(json.data.status).toBe('ok')
            expect(json.data.database).toBe('connected')
        } else {
            expect(json.error.code).toBe('DATABASE_ERROR')
        }
    })
})
