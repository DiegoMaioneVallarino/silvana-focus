
export type TaskPriority = "low" | "medium" | "high";

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  goalId: string | null;
  subtasks: Subtask[];
  createdAt: string;
  completedAt: string | null;
}

export type CreateTaskInput = Pick<
  Task,
  "title" | "description" | "priority" | "dueDate" | "goalId"
>;
