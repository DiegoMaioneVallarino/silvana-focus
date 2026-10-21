
export interface ActivityRecord {
  id: string;
  goalId: string;
  date: string;
  createdAt: string;
}

export interface StreakSettings {
  restDays: number[];
}

export interface StreakSummary {
  current: number;
  longest: number;
  totalActiveDays: number;
  activeToday: boolean;
}
