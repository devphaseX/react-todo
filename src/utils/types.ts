export interface TodoItem {
  id: string;
  title: string;
  status: TaskStatus;
}

export type TaskStatus = 'complete' | 'incomplete';
