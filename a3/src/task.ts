export type Task = {
    id: number;
    title: string;
    done: boolean;
  };
  
  export type TaskUpdate = {
    title?: string;
    done?: boolean;
  };