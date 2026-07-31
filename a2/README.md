# Task API

A simple in-memory to-do list REST API built with Node.js, Express, and TypeScript.

## Features
- Full CRUD for tasks (create, read, update, delete)
- Input validation with clear JSON error messages
- Interactive API docs via Swagger UI
- Strict TypeScript, no database required

## Technologies
- Node.js
- Express
- TypeScript
- swagger-ui-express / OpenAPI 3.0
- tsx (dev runtime)

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

## Data persistence
Data is stored **in memory only** — in a plain array inside the running process. Restarting the server resets it back to the three seed tasks. There is no database in this project.

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