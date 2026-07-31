import express from "express";
import swaggerUi from "swagger-ui-express";
import openapiDocument from "./openapi.json" with { type: "json" };
const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

const tasks = [
	{
		id: 1,
		title: "study for maths test",
		done: false,
	},
	{
		id: 2,
		title: "laundry",
		done: true,
	},
	{
		id: 3,
		title: "gym",
		done: false,
	},
];

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

app.get("/tasks", (req, res) => {
	res.json(tasks);
});

app.get("/tasks/:id", ({ params }, res) => {
	const id = Number(params.id);
	const task = tasks.find((t) => t.id == id);
	if (!task) {
		res.status(404).json({ error: "Task id not found" });
		return;
	}

	res.json(task);
});

app.post("/tasks", (req, res) => {
	const title = req.body.title;

	if (typeof title !== "string" || title.trim().length === 0) {
		res.status(400).json({ error: "Title is required" });
		return;
	}

	const nextId = tasks.length + 1;

	const newTask = {
		id: nextId,
		title: title.trim(),
		done: false,
	};
	tasks.push(newTask);
	res.status(201).json(newTask);
});

app.put("/tasks/:id", ({ params, body }, res) => {
	const id = Number(params.id);
	const task = tasks.find((t) => t.id == id);

	if (!task) {
		res.status(404).json({ error: "Task id not found" });
		return;
	}
	const { title, done } = body ?? {};

	if (title === undefined && done === undefined) {
		res.status(400).json({ error: "Provide at least title or done" });
		return;
	}

	if (title !== undefined) {
		if (typeof title !== "string" || title.trim().length === 0) {
			res.status(400).json({ error: "Title must not be an empty string" });
			return;
		}
		task.title = title;
	}

	if (done !== undefined) {
		if (typeof done !== "boolean") {
			res.status(400).json({ error: "Done must be a boolean" });
			return;
		}
        task.done = done;
	}
	res.json(task);
});

app.delete("/tasks/:id", ({ params }, res) => {
	const id = Number(params.id);
	const index = tasks.findIndex((t) => t.id == id);

	if (index === -1) {
		res.status(404).json({ error: `Task id ${id} not found` });
		return;
	}

	tasks.splice(index, 1);
	res.status(204).send();
});

app.listen(PORT, () => {
	console.log(`Server listening at port ${3000}`);
});
