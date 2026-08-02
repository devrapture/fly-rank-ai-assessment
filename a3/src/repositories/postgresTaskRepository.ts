import { SQL } from "bun";
import type { Task, TaskRepository } from "./taskRepository";

type SqlRow = {
	id: number;
	title: string;
	done: boolean;
};

export class PostgresTaskRepository implements TaskRepository {
	#sql: SQL;

	constructor(connectionString: string) {
		if (!connectionString) {
			throw new Error(
				"DATABASE_URL is required for the Postgres repository. Set it in .env (see .env.example).",
			);
		}
		this.#sql = new SQL(connectionString);
	}

	async list(): Promise<Task[]> {
		const rows = await this.#sql<SqlRow[]>`
			SELECT id, title, done
			FROM tasks
			ORDER BY id
		`;
		return rows.map((row) => this.#toTask(row));
	}

	async get(id: number): Promise<Task | null> {
		const rows = await this.#sql<SqlRow[]>`
			SELECT id, title, done
			FROM tasks
			WHERE id = ${id}
		`;
		const row = rows[0];
		if (!row) {
			return null;
		}
		return this.#toTask(row);
	}

	async create(title: string): Promise<Task> {
		const [row] = await this.#sql<SqlRow[]>`
			INSERT INTO tasks (title, done)
			VALUES (${title}, false)
			RETURNING id, title, done
		`;
		return this.#toTask(row!);
	}

	async update(id: number, title: string, done: boolean): Promise<void> {
		await this.#sql`
			UPDATE tasks
			SET title = ${title}, done = ${done}
			WHERE id = ${id}
		`;
	}

	async remove(id: number): Promise<boolean> {
		const rows = await this.#sql`
			DELETE FROM tasks
			WHERE id = ${id}
			RETURNING id
		`;
		return rows.length > 0;
	}

	async seedIfEmpty(): Promise<void> {
		const rows = await this.#sql`SELECT COUNT(*) AS count FROM tasks`;
		const count = Number(rows[0].count);

		if (count > 0) {
			return;
		}

		await this.#sql`
			INSERT INTO tasks (title, done)
			VALUES
				('study for maths test', false),
				('laundry', true),
				('gym', false)
		`;
	}

	#toTask(row: SqlRow): Task {
		return {
			id: row.id,
			title: row.title,
			done: Boolean(row.done),
		};
	}
}
