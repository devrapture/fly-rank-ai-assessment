import Database from "better-sqlite3";
import type { Task, TaskRepository } from "./taskRepository";

type TaskRow = {
	id: number;
	title: string;
	done: number;
};

export class SqliteTaskRepository implements TaskRepository {
	#db: Database.Database;

	constructor(filename = "tasks.db") {
		this.#db = new Database(filename);
		this.#db
			.prepare(
				`
				CREATE TABLE IF NOT EXISTS tasks (
					id INTEGER PRIMARY KEY,
					title TEXT NOT NULL,
					done INTEGER NOT NULL
				)
			`,
			)
			.run();
	}

	async list(): Promise<Task[]> {
		const rows = this.#db.prepare("SELECT id, title, done FROM tasks ORDER BY id").all() as TaskRow[];
		return rows.map((row) => this.#toTask(row));
	}

	async get(id: number): Promise<Task | null> {
		const row = this.#db.prepare("SELECT id, title, done FROM tasks WHERE id = ?").get(id) as
			| TaskRow
			| undefined;

		if (!row) {
			return null;
		}

		return this.#toTask(row);
	}

	async create(title: string): Promise<Task> {
		const result = this.#db.prepare("INSERT INTO tasks (title, done) VALUES (?, 0)").run(title);

		return {
			id: Number(result.lastInsertRowid),
			title,
			done: false,
		};
	}

	async update(id: number, title: string, done: boolean): Promise<void> {
		this.#db.prepare("UPDATE tasks SET title = ?, done = ? WHERE id = ?").run(title, done ? 1 : 0, id);
	}

	async remove(id: number): Promise<boolean> {
		const result = this.#db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
		return result.changes > 0;
	}

	async seedIfEmpty(): Promise<void> {
		const { count } = this.#db.prepare("SELECT COUNT(*) AS count FROM tasks").get() as {
			count: number;
		};

		if (count > 0) {
			return;
		}

		const insertTask = this.#db.prepare(`
			INSERT INTO tasks (title, done)
			VALUES (?, ?)
		`);
		insertTask.run("study for maths test", 0);
		insertTask.run("laundry", 1);
		insertTask.run("gym", 0);
	}

	#toTask(row: TaskRow): Task {
		return {
			id: row.id,
			title: row.title,
			done: Boolean(row.done),
		};
	}
}
