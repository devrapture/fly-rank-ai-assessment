// import express from "express";
// import swaggerUi from "swagger-ui-express";
// import openapiDocument from "./openapi.json" with { type: "json" };
// import { SQL } from "bun";
// import { PostgresTaskRepository } from "./src/postgres-task-repository";
// import { TaskService } from "./src/task-service";

// const app = express();
// const PORT = Number(process.env.PORT ?? 3000);

// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL is required");
// }

// const sql = new SQL(process.env.DATABASE_URL);
// const repository = new PostgresTaskRepository(sql);
// const taskService = new TaskService(repository);

// app.use(express.json());
// app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

// app.get("/", (req, res) => {
// 	res.json({
// 		name: "Task API",
// 		version: "1.0",
// 		endpoints: ["/tasks"],
// 	});
// });

// app.get("/health", (req, res) => {
// 	res.json({
// 		status: "ok",
// 	});
// });

// function registerRoutes(taskService: TaskService) {
// 	app.get("/tasks", async (_req, res) => {
// 		const tasks = await taskService.findAll();
// 		res.json(tasks);
// 	});

// 	app.get("/tasks/:id", async ({ params }, res) => {
// 		const id = Number(params.id);
// 		const task = await taskService.findById(id);

// 		if (!task) {
// 			res.status(404).json({ error: "Task not found" });
// 			return;
// 		}

// 		res.json(task);
// 	});

// 	app.post("/tasks", async (req, res) => {
// 		const title = req.body.title;

// 		if (typeof title !== "string" || title.trim().length === 0) {
// 			res.status(400).json({ error: "Title is required" });
// 			return;
// 		}

// 		const task = await taskService.create(title.trim());
// 		res.status(201).json(task);
// 	});

// 	app.put("/tasks/:id", async ({ params, body }, res) => {
// 		const id = Number(params.id);
// 		const existingTask = await taskService.findById(id);

// 		if (!existingTask) {
// 			res.status(404).json({ error: "Task not found" });
// 			return;
// 		}

// 		const { title, done } = body ?? {};

// 		if (title === undefined && done === undefined) {
// 			res.status(400).json({ error: "Provide at least title or done" });
// 			return;
// 		}

// 		if (
// 			title !== undefined &&
// 			(typeof title !== "string" || title.trim().length === 0)
// 		) {
// 			res.status(400).json({
// 				error: "Title must not be an empty string",
// 			});
// 			return;
// 		}

// 		if (done !== undefined && typeof done !== "boolean") {
// 			res.status(400).json({ error: "Done must be a boolean" });
// 			return;
// 		}

// 		const task = await taskService.update(id, {
// 			title: title === undefined ? undefined : title.trim(),
// 			done,
// 		});

// 		res.json(task);
// 	});

// 	app.delete("/tasks/:id", async ({ params }, res) => {
// 		const id = Number(params.id);
// 		const deleted = await taskService.delete(id);

// 		if (!deleted) {
// 			res.status(404).json({ error: "Task not found" });
// 			return;
// 		}

// 		res.status(204).send();
// 	});
// }

// async function main() {
// 	registerRoutes(taskService);

// 	app.listen(PORT, () => {
// 		console.log(`Server listening at port ${PORT}`);
// 	});
// }

// main();


import express from "express";
import { config } from "./src/config";
import { authRouter } from "./src/routes/auth";

const app = express();
app.use(express.json());
app.use("/auth", authRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(config.port, () => {
  console.log(`Server running and connected to Supabase on port ${config.port}`);
});