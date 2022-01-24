export interface TodoItem {
  id: string;
  title: string;
  status: TaskStatus;
  date: string;
}

export type TaskStatus = 'all' | 'complete' | 'incomplete';
