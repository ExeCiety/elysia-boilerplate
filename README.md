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

## Benchmark

Load testing with [k6](https://k6.io) - 10 VUs for 60 seconds.

### GET - /

```bash
GET - /

❯ k6 run script.js

         /\      Grafana   /‾‾/
    /\  /  \     |\  __   /  /
   /  \/    \    | |/ /  /   ‾‾\
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/

     execution: local
        script: script.js
        output: -

     scenarios: (100.00%) 1 scenario, 10 max VUs, 1m30s max duration (incl. graceful stop):
              * default: 10 looping VUs for 1m0s (gracefulStop: 30s)



  █ TOTAL RESULTS

    checks_total.......: 1766302 29438.42309/s
    checks_succeeded...: 100.00% 1766302 out of 1766302
    checks_failed......: 0.00%   0 out of 1766302

    ✓ status 200

    HTTP
    http_req_duration..............: avg=315.87µs min=31µs    med=125µs    max=47.48ms p(90)=505µs    p(95)=937µs
      { expected_response:true }...: avg=315.87µs min=31µs    med=125µs    max=47.48ms p(90)=505µs    p(95)=937µs
    http_req_failed................: 0.00%   0 out of 1766302
    http_reqs......................: 1766302 29438.42309/s

    EXECUTION
    iteration_duration.............: avg=336.75µs min=40.25µs med=145.66µs max=47.51ms p(90)=532.79µs p(95)=964.74µs
    iterations.....................: 1766302 29438.42309/s
    vus............................: 10      min=10           max=10
    vus_max........................: 10      min=10           max=10

    NETWORK
    data_received..................: 1.9 GB  32 MB/s
    data_sent......................: 124 MB  2.1 MB/s




running (1m00.0s), 00/10 VUs, 1766302 complete and 0 interrupted iterations
default ✓ [======================================] 10 VUs  1m0s
```

| Metric | Value |
| :--- | :--- |
| Requests/sec | **29,438** |
| Avg Latency | 315.87µs |
| P95 Latency | 937µs |
| Total Requests | 1,766,302 |

### GET - /health/db

```bash
GET - /health/db

❯ k6 run script.js

         /\      Grafana   /‾‾/
    /\  /  \     |\  __   /  /
   /  \/    \    | |/ /  /   ‾‾\
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/

     execution: local
        script: script.js
        output: -

     scenarios: (100.00%) 1 scenario, 10 max VUs, 1m30s max duration (incl. graceful stop):
              * default: 10 looping VUs for 1m0s (gracefulStop: 30s)



  █ TOTAL RESULTS

    checks_total.......: 874652  14577.478425/s
    checks_succeeded...: 100.00% 874652 out of 874652
    checks_failed......: 0.00%   0 out of 874652

    ✓ status 200

    HTTP
    http_req_duration..............: avg=656.76µs min=166µs   med=564µs    max=61.69ms p(90)=969µs    p(95)=1.17ms
      { expected_response:true }...: avg=656.76µs min=166µs   med=564µs    max=61.69ms p(90)=969µs    p(95)=1.17ms
    http_req_failed................: 0.00%  0 out of 874652
    http_reqs......................: 874652 14577.478425/s

    EXECUTION
    iteration_duration.............: avg=682.48µs min=187.2µs med=588.91µs max=63.99ms p(90)=998.83µs p(95)=1.2ms
    iterations.....................: 874652 14577.478425/s
    vus............................: 10     min=10          max=10
    vus_max........................: 10     min=10          max=10

    NETWORK
    data_received..................: 957 MB 16 MB/s
    data_sent......................: 69 MB  1.2 MB/s




running (1m00.0s), 00/10 VUs, 874652 complete and 0 interrupted iterations
default ✓ [======================================] 10 VUs  1m0s
```

| Metric | Value |
| :--- | :--- |
| Requests/sec | **14,577** |
| Avg Latency | 656.76µs |
| P95 Latency | 1.17ms |
| Total Requests | 874,652 |

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
