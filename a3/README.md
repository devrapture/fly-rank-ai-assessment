# Task API

A to-do list REST API built with TypeScript, Express, Bun, and PostgreSQL.

## Architecture

```text
HTTP request
    │
    ▼
Express routes (index.ts)
    │
    ▼
TaskService
    │
    ▼
TaskRepository interface
    │
    ▼
PostgresTaskRepository ──► PostgreSQL
```

- `index.ts` configures Express, creates the repository and service, and registers the routes.
- `src/task-service.ts` contains the application-facing task operations.
- `src/task-repository.ts` defines the persistence contract.
- `src/postgres-task-repository.ts` implements the contract with `Bun.sql`.
- `src/task.ts` contains the shared task types.
- `db/init.sql` creates and seeds the database when PostgreSQL initializes a new volume.

## Run with Docker

Requirements: Docker and the Docker Compose plugin.

```bash
cp .env.example .env
docker compose up --build
```

The API is available at `http://localhost:3000`, and its Swagger UI is at
`http://localhost:3000/docs`.

To run in the background:

```bash
docker compose up --build -d
```

To stop the containers without deleting the database volume:

```bash
docker compose down
```

## Configuration

The committed `.env.example` contains the required values:

```dotenv
POSTGRES_USER=task_user
POSTGRES_PASSWORD=change_me
POSTGRES_DB=task_api
DATABASE_URL=postgresql://task_user:change_me@db:5432/task_api
PORT=3000
```

The hostname `db` is the PostgreSQL service name inside Docker Compose. If you
run the app directly on the host, change that hostname to `localhost`.

## Development

Start PostgreSQL, set a host-accessible `DATABASE_URL`, and then run:

```bash
bun install
bun run dev
```

Check the TypeScript types with:

```bash
bun run type-check
```

## Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | API information |
| `GET` | `/health` | Health check |
| `GET` | `/tasks` | List tasks |
| `GET` | `/tasks/:id` | Get a task |
| `POST` | `/tasks` | Create a task |
| `PUT` | `/tasks/:id` | Update a task |
| `DELETE` | `/tasks/:id` | Delete a task |

Task data is stored in the `postgres_data` Docker volume and survives container
restarts and `docker compose down`. Running `docker compose down -v` deletes the
volume and causes the schema and seed data to be recreated on the next startup.

## Project structure

```text
.
├── db/
│   └── init.sql
├── src/
│   ├── postgres-task-repository.ts
│   ├── task-repository.ts
│   ├── task-service.ts
│   └── task.ts
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── index.ts
├── openapi.json
├── package.json
└── tsconfig.json
```
