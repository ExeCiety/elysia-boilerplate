# ElysiaJS Production-Ready Boilerplate

REST API boilerplate menggunakan **ElysiaJS** dengan **Bun** runtime, **Drizzle ORM**, dan **PostgreSQL**.

## Features

- 🚀 **Bun Runtime** - High-performance JavaScript runtime
- 🦊 **ElysiaJS** - Fast and type-safe web framework
- 🗃️ **Drizzle ORM** - Type-safe SQL ORM with migrations
- 🔒 **Security** - CORS, rate limiting, secure headers
- 📝 **Logging** - Structured JSON logging with levels
- 🔄 **Graceful Shutdown** - Proper cleanup on SIGINT/SIGTERM
- ✅ **Validation** - Request validation with TypeBox
- 🏗️ **Clean Architecture** - Controller → Service → Repository pattern

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- PostgreSQL 14+

### Installation

```bash
# Clone and install dependencies
cd elysia-boilerplate
bun install

# Copy environment file
cp .env.example .env
# Edit .env with your database credentials
```

### Database Setup

```bash
# Generate migrations from schema
bun run db:generate

# Run migrations
bun run db:migrate

# (Optional) Open Drizzle Studio
bun run db:studio
```

### Running the Server

```bash
# Development (with hot reload)
bun run dev

# Production
bun run start
```

## API Endpoints

### Health

| Method | Endpoint      | Description          |
|--------|---------------|----------------------|
| GET    | /health       | Server health check  |
| GET    | /health/db    | Database health check|

### Users

| Method | Endpoint      | Description          |
|--------|---------------|----------------------|
| POST   | /users        | Create a new user    |
| GET    | /users        | List users (paginated)|
| GET    | /users/:id    | Get user by ID       |
| PATCH  | /users/:id    | Update user          |
| DELETE | /users/:id    | Delete user          |

### Request Examples

```bash
# Create user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Get all users (page 1, limit 10)
curl "http://localhost:3000/users?page=1&limit=10"

# Get user by ID
curl http://localhost:3000/users/<uuid>

# Update user
curl -X PATCH http://localhost:3000/users/<uuid> \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe"}'

# Delete user
curl -X DELETE http://localhost:3000/users/<uuid>
```

## Project Structure

```
elysia-boilerplate/
├── src/
│   ├── app.ts                 # Elysia app setup
│   ├── server.ts              # Server entry point
│   ├── config/
│   │   ├── env.ts             # Environment configuration
│   │   └── index.ts
│   ├── db/
│   │   └── index.ts           # Drizzle connection
│   ├── middlewares/
│   │   ├── cors.ts
│   │   ├── rateLimit.ts
│   │   ├── secureHeaders.ts
│   │   ├── requestId.ts
│   │   ├── logger.ts
│   │   └── index.ts
│   ├── modules/
│   │   ├── health/
│   │   │   └── health.routes.ts
│   │   └── users/
│   │       ├── users.model.ts      # Drizzle schema
│   │       ├── users.schemas.ts    # Validation schemas
│   │       ├── users.repository.ts # Database layer
│   │       ├── users.service.ts    # Business logic
│   │       ├── users.controller.ts # Request handling
│   │       └── users.routes.ts     # Route definitions
│   └── utils/
│       ├── errors.ts
│       ├── response.ts
│       ├── pagination.ts
│       └── index.ts
├── drizzle/
│   └── migrations/            # Generated migrations
├── drizzle.config.ts          # Drizzle Kit config
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Architecture

```
Request → Middlewares → Controller → Service → Repository → Database
                ↓
           Response
```

### Flow

1. **Middlewares**: Process request (CORS, rate limit, logging, request ID)
2. **Controller**: Handle HTTP request/response, call service
3. **Service**: Business logic, validation, orchestration
4. **Repository**: Direct database operations via Drizzle ORM

### Dependency Injection

Uses simple manual DI - dependencies are passed via constructor:

```typescript
// Repository
class UsersRepository { ... }

// Service receives repository
class UsersService {
  constructor(private repo = new UsersRepository()) {}
}

// Controller receives service
class UsersController {
  constructor(private service = new UsersService()) {}
}
```

## Environment Variables

| Variable              | Description                        | Default     |
|-----------------------|------------------------------------|-------------|
| `NODE_ENV`            | Environment (development/production) | development |
| `PORT`                | Server port                        | 3000        |
| `HOST`                | Server host                        | 0.0.0.0     |
| `DATABASE_URL`        | PostgreSQL connection string       | (required)  |
| `CORS_ORIGINS`        | Allowed origins (comma-separated)  | *           |
| `CORS_METHODS`        | Allowed methods                    | GET,POST... |
| `CORS_HEADERS`        | Allowed headers                    | Content-Type,Authorization |
| `CORS_CREDENTIALS`    | Allow credentials                  | false       |
| `RATE_LIMIT_MAX`      | Max requests per window            | 100         |
| `RATE_LIMIT_WINDOW_MS`| Rate limit window (ms)             | 60000       |
| `LOG_LEVEL`           | Log level (debug/info/warn/error)  | info        |

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "requestId": "uuid"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "requestId": "uuid"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  },
  "requestId": "uuid"
}
```

## License

MIT
