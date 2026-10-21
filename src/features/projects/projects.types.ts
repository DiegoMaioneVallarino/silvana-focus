
export type ProjectStatus =
  | "planning"
  | "active"
  | "paused"
  | "completed";

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  status: ProjectStatus;
  goalId: string | null;
  dueDate: string | null;
  createdAt: string;
  completedAt: string | null;
}

export type CreateProjectInput = Pick<
  Project,
  "name" | "description" | "color" | "goalId" | "dueDate"
>;

export type UpdateProjectInput = Partial<
  Pick<
    Project,
    "name" | "description" | "color" | "status" | "goalId" | "dueDate"
  >
>;
