
export type ActivityCategory =
  | "learning"
  | "project"
  | "exercise"
  | "routine"
  | "other";

export interface ActivitySession {
  id: string;
  goalId: string | null;
  title: string;
  category: ActivityCategory;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  source: "timer" | "manual";
}

export interface ActiveTimer {
  title: string;
  goalId: string | null;
  category: ActivityCategory;
  startedAt: string;
  accumulatedSeconds: number;
  resumedAt: string | null;
}
