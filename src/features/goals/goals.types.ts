
export type GoalStageStatus =
  | "locked"
  | "available"
  | "completed";

export interface GoalStage {
  id: string;
  title: string;
  description: string;
  status: GoalStageStatus;
  completedAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  durationMonths: number;
  stages: GoalStage[];
}

export type CreateGoalInput = Pick<
  Goal,
  "title" | "description" | "durationMonths"
>;
