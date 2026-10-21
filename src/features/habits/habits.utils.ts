
import type { Habit, HabitStats } from "./habits.types";

import {
  addDays,
  fromLocalDateKey,
  toLocalDateKey,
} from "../streaks/streaks.utils";

export function isHabitScheduled(
  habit: Habit,
  date: string
): boolean {
  const day = fromLocalDateKey(date).getDay();

  return (
    habit.frequency === "daily" ||
    habit.daysOfWeek.includes(day)
  );
}

export function getHabitStartDate(habit: Habit): string {
  return toLocalDateKey(new Date(habit.createdAt));
}

export function getHabitWeekDates(
  today = new Date()
): string[] {
  const current = toLocalDateKey(today);
  const dayOfWeek = today.getDay();

  // Semana de lunes a domingo.
  const mondayOffset = (dayOfWeek + 6) % 7;
  const monday = addDays(current, -mondayOffset);

  return Array.from(
    { length: 7 },
    (_, index) => addDays(monday, index)
  );
}

export function getHabitStats(
  habit: Habit,
  today = toLocalDateKey(new Date())
): HabitStats {
  const startDate = getHabitStartDate(habit);
  const endDate = habit.archivedAt
    ? [today, toLocalDateKey(new Date(habit.archivedAt))]
        .sort()[0]
    : today;

  const completed = new Set(habit.completedDates);

  const scheduledToday =
    !habit.archivedAt &&
    today >= startDate &&
    isHabitScheduled(habit, today);

  const completedToday =
    scheduledToday && completed.has(today);

  if (endDate < startDate) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      completedDays: 0,
      completionRate: 0,
      completedToday,
      scheduledToday,
    };
  }

  let scheduledCount = 0;
  let completedCount = 0;

  let longestStreak = 0;
  let runningStreak = 0;

  const scheduledDates: string[] = [];

  for (
    let date = startDate;
    date <= endDate;
    date = addDays(date, 1)
  ) {
    if (!isHabitScheduled(habit, date)) {
      continue;
    }

    scheduledDates.push(date);
    scheduledCount++;

    if (completed.has(date)) {
      completedCount++;
      runningStreak++;

      longestStreak = Math.max(
        longestStreak,
        runningStreak
      );
    } else {
      runningStreak = 0;
    }
  }

  // La racha actual no se rompe mientras el día
  // programado de hoy todavía no haya terminado.
  let currentStreak = 0;

  for (
    let index = scheduledDates.length - 1;
    index >= 0;
    index--
  ) {
    const date = scheduledDates[index];

    if (
      date === today &&
      !completed.has(date) &&
      !habit.archivedAt
    ) {
      continue;
    }

    if (!completed.has(date)) {
      break;
    }

    currentStreak++;
  }

  return {
    currentStreak,
    longestStreak,
    completedDays: completedCount,
    completionRate:
      scheduledCount === 0
        ? 0
        : Math.round(
            (completedCount / scheduledCount) * 100
          ),
    completedToday,
    scheduledToday,
  };
}
