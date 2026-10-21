
export type HabitFrequency = "daily" | "weekly";

export interface Habit {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;

  frequency: HabitFrequency;

  // 0 = domingo, 1 = lunes, ... 6 = sábado
  daysOfWeek: number[];

  goalId: string | null;

  // Fechas YYYY-MM-DD en horario local
  completedDates: string[];

  createdAt: string;
  archivedAt: string | null;
}

export type CreateHabitInput = Pick<
  Habit,
  | "title"
  | "description"
  | "emoji"
  | "color"
  | "frequency"
  | "daysOfWeek"
  | "goalId"
>;

export type UpdateHabitInput = Partial<CreateHabitInput>;

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  completedDays: number;
  completionRate: number;
  completedToday: boolean;
  scheduledToday: boolean;
}
