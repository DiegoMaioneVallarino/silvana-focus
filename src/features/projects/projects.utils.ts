
import type { Task } from "../tasks/tasks.types";

export interface ProjectProgress {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  percentage: number;
}

export function getProjectTasks(
  tasks: Task[],
  projectId: string
): Task[] {
  return tasks.filter(
    (task) => task.projectId === projectId
  );
}

export function getProjectProgress(
  tasks: Task[],
  projectId: string
): ProjectProgress {
  const projectTasks = getProjectTasks(tasks, projectId);

  const total = projectTasks.length;

  const completed = projectTasks.filter(
    (task) => task.status === "completed"
  ).length;

  const inProgress = projectTasks.filter(
    (task) => task.status === "in_progress"
  ).length;

  const pending = projectTasks.filter(
    (task) => task.status === "pending"
  ).length;

  return {
    total,
    completed,
    pending,
    inProgress,
    percentage:
      total === 0
        ? 0
        : Math.round((completed / total) * 100),
  };
}
