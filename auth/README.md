# Secure Supabase Auth API

A JWT-based authentication REST API built with Express, TypeScript, Bun, and
Supabase Auth. It provides signup, login, and logout, plus JWT-protected
private routes.

## Architecture

```text
HTTP request
    │
    ▼
Express app (index.ts)
    │
    ├── /auth       ──► Supabase Auth (signup, login, logout)
    ├── /public     ──► open endpoints
    └── /protected  ──► requireAuth middleware ──► Supabase Auth (JWT verify)
```

- `index.ts` configures Express, mounts the routers, and serves the OpenAPI
  docs.
- `src/routes/auth.ts` handles signup, login, and logout against Supabase Auth.
- `src/routes/public.ts` exposes open, unauthenticated endpoints.
- `src/routes/protected.ts` exposes JWT-protected endpoints.
- `src/middleware/require-auth.ts` parses the `Authorization` header and
  verifies the bearer token via `supabase.auth.getUser`.
- `src/config.ts` loads `SUPABASE_URL`, `SUPABASE_KEY`, and `PORT`.
- `src/supabase.ts` creates the Supabase client (server-side, non-persistent).
- `src/types.ts` augments Express `Request` with the authenticated user.
- `openapi.json` is the OpenAPI 3.0 specification served at `/docs`.

## Requirements

- [Bun](https://bun.sh) (>= 1.x)
- A [Supabase](https://supabase.com) project

## Setup

```bash
cp .env.example .env
```

Then fill in your Supabase credentials:

```dotenv
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
PORT=3000
```

> `SUPABASE_URL` and `SUPABASE_KEY` are required; the server refuses to start
> without them.

## Run

```bash
bun install
bun run dev        # development (hot reload)
bun run start      # production
```

The API is available at `http://localhost:3000`, and its Swagger UI is at
`http://localhost:3000/docs`.

## Run with Docker

Requirements: Docker and the Docker Compose plugin.

```bash
cp .env.example .env
docker compose up --build
```

To run in the background and stop it afterwards:

```bash
docker compose up --build -d
docker compose down
```

## Type checking

```bash
bun run type-check
```

## Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/signup` | No | Create an account |
| `POST` | `/auth/login` | No | Log in and receive tokens |
| `POST` | `/auth/logout` | Bearer | Log out the current session |
| `GET` | `/public/info` | No | Get public information |
| `GET` | `/protected/profile` | Bearer | Get the current user's profile |
| `GET` | `/protected/dashboard` | Bearer | Get the current user's dashboard |
| `GET` | `/health` | No | Health check |

### Sign up

```http
POST /auth/signup
Content-Type: application/json

{ "email": "test@example.com", "password": "password123" }
```

Responds with `201` and the created user, plus
`email_confirmation_required: true` when the project requires email
confirmation before a session is issued.

### Log in

```http
POST /auth/login
Content-Type: application/json

{ "email": "test@example.com", "password": "password123" }
```

Responds with `200` and the `access_token`, `refresh_token`, `expires_in`, and
`token_type`. Use the access token as a bearer token for protected routes:

```http
GET /protected/profile
Authorization: Bearer <access_token>
```

Login failures return a generic `401` so clients cannot tell whether an
account exists.

### Log out

```http
POST /auth/logout
Authorization: Bearer <access_token>
```

Responds with `204` on success. Requires a valid access token.

## Project structure

```text
.
├── db/
├── src/
│   ├── config.ts
│   ├── supabase.ts
│   ├── types.ts
│   ├── middleware/
│   │   └── require-auth.ts
│   └── routes/
│       ├── auth.ts
│       ├── protected.ts
│       └── public.ts
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── index.ts
├── openapi.json
├── package.json
└── tsconfig.json
```
