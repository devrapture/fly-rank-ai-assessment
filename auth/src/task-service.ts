import type { TaskUpdate } from "./task";
import type { TaskRepository } from "./task-repository";

export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  findAll() {
    return this.repository.findAll();
  }

  findById(id: number) {
    return this.repository.findById(id);
  }

  create(title: string) {
    return this.repository.create(title);
  }

  update(id: number, changes: TaskUpdate) {
    return this.repository.update(id, changes);
  }

  delete(id: number) {
    return this.repository.delete(id);
  }
}