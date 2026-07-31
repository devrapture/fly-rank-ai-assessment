# Task API

A persistent to-do list REST API built with Node.js, Express, TypeScript and SQLite.

## Features

- Full CRUD for tasks
- Persistent task storage using SQLite
- Automatic database and table creation
- Input validation with clear JSON error messages
- Interactive API documentation through Swagger UI

## Technologies

- Node.js
- Express
- TypeScript
- SQLite
- better-sqlite3
- swagger-ui-express
- tsx

## Why SQLite?

SQLite was chosen because it is lightweight and stores the complete database in a single file. It does not require a separate database server or additional installation.

This makes it suitable for a small CRUD project while allowing task data to survive application restarts.

## Database

The application stores task data in:

`tasks.db`

The file is created automatically in the root of the project when the application starts.

The application also creates the `tasks` table automatically when it does not already exist.

## Requirements
- Node.js 18+
- npm

## Installation
\`\`\`bash
git clone https://github.com/devrapture/todo-api.git
cd todo-api
npm install
\`\`\`

## Running the dev server
\`\`\`bash
npm run dev
\`\`\`
Server runs at `http://localhost:3000`.

## Type checking
\`\`\`bash
npm run type-check
\`\`\`

## API Documentation
Interactive Swagger docs: `http://localhost:3000/docs`

![Swagger UI screenshot](docs-screenshot.png)
<!-- Replace with an actual screenshot of your /docs page -->

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

## Example request
\`\`\`bash
curl -i -X POST http://localhost:3000/tasks \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Buy milk"}'
\`\`\`

## Example response
\`\`\`json
{
  "id": 4,
  "title": "Buy milk",
  "done": false
}
\`\`\`

## Database screenshot
<img width="1440" height="900" alt="image" src="https://github.com/user-attachments/assets/fce4c60c-dd49-4e3c-9da6-710c467547e9" />

## Example SQL query

The following query returns all completed tasks:

```sql
SELECT * FROM tasks WHERE done = 1;

## Project structure
\`\`\`text
todo-api/
├── src/
│   └── index.ts
├── openapi.json
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
\`\`\`

## What I learned
- How to build a REST API with Express and TypeScript
- Why input validation matters, and how to write it defensively
- The meaning and correct use of HTTP status codes (200, 201, 204, 400, 404)
- How OpenAPI and Swagger UI work together to document an API
- Why in-memory data doesn't survive a restart
