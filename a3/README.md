# Task API

A to-do list REST API built with TypeScript, Express and **PostgreSQL running in Docker**.

This assignment proves two things:

1. **Data survives a restart** — Postgres runs in a Docker container with a named volume, so the database outlives both the app process and the container.
2. **Storage is swappable** — all persistence lives behind a `TaskRepository` interface. The service and the HTTP routes only depend on that interface, so switching the database does **not** touch them.

## Architecture

```text
┌─────────────┐   HTTP   ┌──────────────────────────────┐   SQL   ┌──────────────┐
│   client    │ ───────► │ index.ts (Express + routes)   │ ──────► │  Postgres    │
│  curl/docs  │          │  depends on TaskRepository    │         │  (Docker)    │
└─────────────┘          └──────────────────────────────┘         └──────────────┘
                                ▲
                                │ implements
                     ┌──────────┴──────────┐
                     │  PostgresTaskRepo   │   (active — STORAGE=postgres)
                     │  SqliteTaskRepo     │   (kept as an alternative — STORAGE=sqlite)
                     └─────────────────────┘
```

- `index.ts` — service layer + HTTP routes. It creates a repository through
  `createTaskRepository()` (`src/repositories/index.ts`) and never touches the
  database directly.
- `src/repositories/taskRepository.ts` — the `TaskRepository` interface and the
  `Task` type both implementations agree on.
- `src/repositories/postgresTaskRepository.ts` — real Postgres implementation
  (uses `Bun.sql`).
- `src/repositories/sqliteTaskRepository.ts` — the previous SQLite store, kept
  behind the same interface so the swap can be demonstrated.
- `db/init.sql` — creates the `tasks` table (auto-run by Postgres on first boot).
- `docker-compose.yml` — runs the whole stack (app + database) with one command.

### Honest note on "service and routes unchanged"

The previous version of this service stored everything in a single flat
`index.ts` using SQLite directly. To make the swap real, the persistence layer
was first extracted behind the `TaskRepository` interface. Since then, the HTTP
routes (paths, methods, validation, status codes, response shapes) have not
changed and they do not depend on any concrete database. Swapping storage is a
**config change only**: set `STORAGE=postgres` or `STORAGE=sqlite` in `.env`.
No route or service code changes.

## Requirements

- Docker with the Docker Compose plugin
- (only for running the app outside Docker) Bun 1.x

## Run the whole stack (one command)

```bash
docker compose up --build
```

`docker compose up` builds the app image, starts Postgres, and runs both. Wait
for `Server listening at port 3000` in the logs.

- API: http://localhost:3000
- Swagger docs: http://localhost:3000/docs

## Configuration

The connection string and credentials live in `.env` (gitignored). A template
is committed as `.env.example` — copy it to get started:

```bash
cp .env.example .env
```

```dotenv
POSTGRES_USER=todo
POSTGRES_PASSWORD=todo
POSTGRES_DB=todo
POSTGRES_PORT=5432
DATABASE_URL=postgres://todo:todo@localhost:5432/todo
STORAGE=postgres
PORT=3000
```

Docker Compose reads `POSTGRES_*` from `.env` to configure the database and
builds the app container's `DATABASE_URL` pointing at the `db` service. Inside
Docker the host is `db`, not `localhost`; outside Docker (running the app
directly with `bun run index.ts`) `DATABASE_URL` points at `localhost`.

The app reads the connection string from `DATABASE_URL`. `STORAGE` picks the
repository (`postgres` is the default; `sqlite` is the fallback used to prove
the architecture).

## The table

`db/init.sql`:

```sql
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    done BOOLEAN NOT NULL DEFAULT FALSE
);
```

It is mounted into the Postgres container's `/docker-entrypoint-initdb.d/`, so
Postgres runs it automatically the first time the volume is created.

## Data is persisted on a Docker volume

`docker-compose.yml` mounts a named volume `pgdata` at Postgres's data
directory (`/var/lib/postgresql/data`). The volume is managed by Docker, so the
database file survives `docker compose down`, container removal and app
restarts. It is only wiped if you explicitly delete it with
`docker volume rm <name>_pgdata` (or `docker compose down -v`).

## Proving persistence (how it was checked)

1. Start the stack and create some rows:

   ```bash
   docker compose up --build -d
   curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Buy milk"}'
   curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Water the plants"}'
   curl http://localhost:3000/tasks
   ```

   Observed response:

   ```json
   [
     { "id": 1, "title": "study for maths test", "done": false },
     { "id": 2, "title": "laundry", "done": true },
     { "id": 3, "title": "gym", "done": false },
     { "id": 4, "title": "Buy milk", "done": false },
     { "id": 5, "title": "Water the plants", "done": false }
   ]
   ```

2. Restart the app container only:

   ```bash
   docker compose restart app
   curl http://localhost:3000/tasks
   ```

   `Buy milk` and `Water the plants` are still there.

3. Restart the database container too (the container is recreated from the
   image — only the volume carries the data):

   ```bash
   docker compose up -d --force-recreate db
   docker compose restart app
   curl http://localhost:3000/tasks
   ```

   The same rows are still returned. Because the app only seeds sample data
   when the table is empty (`seedIfEmpty`), the fact that rows are not
   duplicated also confirms the data survived.

## Endpoints

| Method | Endpoint      | Description        |
|--------|---------------|---------------------|
| GET    | `/`           | Get API information |
| GET    | `/health`     | Check server health  |
| GET    | `/tasks`      | Get all tasks       |
| GET    | `/tasks/:id`  | Get one task        |
| POST   | `/tasks`      | Create a task        |
| PUT    | `/tasks/:id`  | Update a task        |
| DELETE | `/tasks/:id`  | Delete a task        |

## Development

```bash
cp .env.example .env
docker compose up -d --build   # or: docker compose up db   to run only the database
bun run dev                    # run the app locally against the containerised Postgres
bun run type-check             # TypeScript check
```

## Project structure

```text
.
├── index.ts                        # service + routes (depends only on TaskRepository)
├── src/repositories/
│   ├── taskRepository.ts           # TaskRepository interface + Task type
│   ├── postgresTaskRepository.ts   # Postgres implementation (Bun.sql)
│   ├── sqliteTaskRepository.ts     # previous SQLite store, same interface
│   └── index.ts                    # picks the repository from STORAGE
├── db/
│   └── init.sql                    # creates the tasks table
├── docker-compose.yml              # app + database together
├── Dockerfile
├── .env.example                    # committed template (no secrets)
├── .env                            # real config (gitignored)
├── openapi.json
├── package.json
└── README.md
```

## What I learned

- Running Postgres in Docker with a named volume gives you a real database that
  survives restarts — the difference between a demo and a project.
- Putting the connection string in `.env` (gitignored) with a committed
  `.env.example` keeps secrets out of the repo.
- A repository interface is what makes storage swappable: the service and routes
  never change, only the implementation (and a config value) does.
- `docker compose up` is the one command that runs the whole stack.
