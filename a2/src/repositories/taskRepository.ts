export type Task = {
	id: number;
	title: string;
	done: boolean;
};

export interface TaskRepository {
	list(): Promise<Task[]>;
	get(id: number): Promise<Task | null>;
	create(title: string): Promise<Task>;
	update(id: number, title: string, done: boolean): Promise<void>;
	remove(id: number): Promise<boolean>;
	seedIfEmpty(): Promise<void>;
}
