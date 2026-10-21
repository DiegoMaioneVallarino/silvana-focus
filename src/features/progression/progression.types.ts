
export type XPSource =
  | "task"
  | "habit"
  | "focus"
  | "goal_stage"
  | "project";

export interface XPReward {
  id: string;
  source: XPSource;
  sourceId: string;
  amount: number;
  awardedAt: string;
  active: boolean;
}

export interface LevelInfo {
  level: number;
  title: string;
  totalXP: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progressXP: number;
  requiredXP: number;
  progressPercent: number;
}

export type AchievementId =
  | "first_task"
  | "habit_streak_7"
  | "focus_10_hours"
  | "first_project"
  | "five_goal_stages";

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface ProgressionSummary {
  totalXP: number;
  lifetimeXP: number;
  todayXP: number;
  level: LevelInfo;
  unlockedAchievements: number;
  totalAchievements: number;
}
