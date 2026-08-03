import { SQL } from "bun";
import type { Task, TaskUpdate } from "./task";
import type { TaskRepository } from "./task-repository";

type TaskRow = {
  id: number;
  title: string;
  done: boolean;
};

export class PostgresTaskRepository implements TaskRepository {
  constructor(private readonly sql: SQL) {}

  async findAll(): Promise<Task[]> {
    const rows = await this.sql<TaskRow[]>`
      SELECT id, title, done
      FROM tasks
      ORDER BY id
    `;

    return rows;
  }

  async findById(id: number): Promise<Task | null> {
    const rows = await this.sql<TaskRow[]>`
      SELECT id, title, done
      FROM tasks
      WHERE id = ${id}
    `;

    return rows[0] ?? null;
  }

  async create(title: string): Promise<Task> {
    const rows = await this.sql<TaskRow[]>`
      INSERT INTO tasks (title, done)
      VALUES (${title}, false)
      RETURNING id, title, done
    `;

    const task = rows[0];

    if (!task) {
      throw new Error("Failed to create task");
    }

    return task;
  }

  async update(id: number, changes: TaskUpdate): Promise<Task | null> {
    const existing = await this.findById(id);

    if (!existing) {
      return null;
    }

    const title = changes.title ?? existing.title;
    const done = changes.done ?? existing.done;

    const rows = await this.sql<TaskRow[]>`
      UPDATE tasks
      SET title = ${title}, done = ${done}
      WHERE id = ${id}
      RETURNING id, title, done
    `;

    return rows[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const rows = await this.sql<{ id: number }[]>`
      DELETE FROM tasks
      WHERE id = ${id}
      RETURNING id
    `;

    return rows.length > 0;
  }
}
