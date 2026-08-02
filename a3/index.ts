import express from "express";
import swaggerUi from "swagger-ui-express";
import openapiDocument from "./openapi.json" with { type: "json" };
import { createTaskRepository } from "./src/repositories";
import type { TaskRepository } from "./src/repositories/taskRepository";

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

app.get("/", (req, res) => {
	res.json({
		name: "Task API",
		version: "1.0",
		endpoints: ["/tasks"],
	});
});

app.get("/health", (req, res) => {
	res.json({
		status: "ok",
	});
});

function registerRoutes(repo: TaskRepository) {
	app.get("/tasks", async (req, res) => {
		const tasks = await repo.list();
		res.json(tasks);
	});

	app.get("/tasks/:id", async ({ params }, res) => {
		const id = Number(params.id);

		const task = await repo.get(id);

		if (!task) {
			res.status(404).json({ error: "Task not found" });
			return;
		}

		res.json(task);
	});

	app.post("/tasks", async (req, res) => {
		const title = req.body.title;

		if (typeof title !== "string" || title.trim().length === 0) {
			res.status(400).json({ error: "Title is required" });
			return;
		}

		const newTask = await repo.create(title.trim());

		res.status(201).json(newTask);
	});

	app.put("/tasks/:id", async ({ params, body }, res) => {
		const id = Number(params.id);

		const existingTask = await repo.get(id);

		if (!existingTask) {
			res.status(404).json({ error: "Task not found" });
			return;
		}

		const { title, done } = body ?? {};

		if (title === undefined && done === undefined) {
			res.status(400).json({ error: "Provide at least title or done" });
			return;
		}

		if (
			title !== undefined &&
			(typeof title !== "string" || title.trim().length === 0)
		) {
			res.status(400).json({
				error: "Title must not be an empty string",
			});
			return;
		}

		if (done !== undefined && typeof done !== "boolean") {
			res.status(400).json({ error: "Done must be a boolean" });
			return;
		}

		const updatedTitle = title === undefined ? existingTask.title : title.trim();
		const updatedDone = done === undefined ? existingTask.done : done;

		await repo.update(id, updatedTitle, updatedDone);

		res.json({
			id,
			title: updatedTitle,
			done: updatedDone,
		});
	});

	app.delete("/tasks/:id", async ({ params }, res) => {
		const id = Number(params.id);

		const deleted = await repo.remove(id);

		if (!deleted) {
			res.status(404).json({ error: "Task not found" });
			return;
		}

		res.status(204).send();
	});
}

async function main() {
	const repo = await createTaskRepository();
	await repo.seedIfEmpty();
	registerRoutes(repo);

	app.listen(PORT, () => {
		console.log(`Server listening at port ${PORT}`);
	});
}

main();
