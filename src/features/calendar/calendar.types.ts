
export type CalendarEventCategory =
  | "learning"
  | "project"
  | "exercise"
  | "routine"
  | "finance"
  | "other";

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  category: CalendarEventCategory;
  goalId: string | null;
  completed: boolean;
  createdAt: string;
}

export type CreateCalendarEvent = Omit<
  CalendarEvent,
  "id" | "completed" | "createdAt"
>;
