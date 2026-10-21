
export type StatisticsPeriod =
  | "week"
  | "month"
  | "all";

export interface DailyFocusData {
  date: string;
  label: string;
  seconds: number;
  sessions: number;
}

export interface ProductivityStats {
  totalFocusSeconds: number;
  completedTasks: number;
  totalTasks: number;
  completedHabitChecks: number;
  scheduledHabitChecks: number;
  completedProjects: number;
  totalProjects: number;
  earnedXP: number;
}

export interface CategoryTimeData {
  category: string;
  seconds: number;
  percentage: number;
}
