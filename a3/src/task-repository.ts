import type { Task, TaskUpdate } from "./task";

export interface TaskRepository {
  findAll(): Promise<Task[]>;
  findById(id: number): Promise<Task | null>;
  create(title: string): Promise<Task>;
  update(id: number, changes: TaskUpdate): Promise<Task | null>;
  delete(id: number): Promise<boolean>;
}