import type { TaskRepository } from "./taskRepository";

export async function createTaskRepository(): Promise<TaskRepository> {
	const storage = (process.env.STORAGE ?? "postgres").toLowerCase();

	if (storage === "sqlite") {
		const { SqliteTaskRepository } = await import("./sqliteTaskRepository");
		return new SqliteTaskRepository();
	}

	const { PostgresTaskRepository } = await import("./postgresTaskRepository");
	return new PostgresTaskRepository(process.env.DATABASE_URL ?? "");
}
