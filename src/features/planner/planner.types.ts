export type PlannerSource =
  | "task"
  | "habit"
  | "calendar"
  | "academy"
  | "manual";

export type PlannerBlockStatus =
  | "planned"
  | "completed"
  | "skipped";

export type PlannerPriority =
  | "low"
  | "medium"
  | "high";

export interface PlannerBlock {
  id: string;
  title: string;
  date: string;
  startTime: string;
  durationMinutes: number;

  source: PlannerSource;
  sourceId: string | null;

  priority: PlannerPriority;
  status: PlannerBlockStatus;

  createdAt: string;
  completedAt: string | null;
}

export interface CreatePlannerBlockInput {
  title: string;
  date: string;
  startTime: string;
  durationMinutes: number;

  source?: PlannerSource;
  sourceId?: string | null;
  priority?: PlannerPriority;
}

export interface PlannerConflict {
  blockId: string;
  conflictingBlockId: string;
}

export interface PlannerDaySummary {
  totalBlocks: number;
  completedBlocks: number;
  skippedBlocks: number;
  plannedMinutes: number;
  completedMinutes: number;
  completionPercent: number;
}