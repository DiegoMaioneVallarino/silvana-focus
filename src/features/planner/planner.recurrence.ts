import type { Habit } from "../habits/habits.types";
import type { PlannerBlock } from "./planner.types";

import { usePlannerStore } from "./planner.store";
import { scheduleSource } from "./planner.sync";

export interface HabitScheduleInput {
  habit: Habit;
  startDate: string;
  startTime: string;
  durationMinutes: number;
  daysToGenerate: number;
}

export interface HabitScheduleResult {
  created: number;
  skipped: number;
  errors: string[];
}

function parseLocalDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day, 12);
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isHabitScheduledOnDate(
  habit: Habit,
  date: string
): boolean {
  if (habit.archivedAt) return false;

  const day = parseLocalDate(date);

  if (Number.isNaN(day.getTime())) return false;

  return (
    habit.frequency === "daily" ||
    habit.daysOfWeek.includes(day.getDay())
  );
}

export function generateHabitSchedule({
  habit,
  startDate,
  startTime,
  durationMinutes,
  daysToGenerate,
}: HabitScheduleInput): HabitScheduleResult {
  const result: HabitScheduleResult = {
    created: 0,
    skipped: 0,
    errors: [],
  };

  if (habit.archivedAt) {
    result.errors.push("No se pueden programar hábitos archivados.");
    return result;
  }

  if (
    !Number.isInteger(daysToGenerate) ||
    daysToGenerate < 1 ||
    daysToGenerate > 7
  ) {
    result.errors.push("Selecciona entre 1 y 7 días.");
    return result;
  }

  const start = parseLocalDate(startDate);

  if (Number.isNaN(start.getTime())) {
    result.errors.push("La fecha inicial no es válida.");
    return result;
  }

  for (let index = 0; index < daysToGenerate; index++) {
    const current = new Date(start);
    current.setDate(start.getDate() + index);

    const date = toDateKey(current);

    if (!isHabitScheduledOnDate(habit, date)) {
      result.skipped++;
      continue;
    }

    const scheduled = scheduleSource({
      source: "habit",
      sourceId: habit.id,
      title: `${habit.emoji} ${habit.title}`,
      date,
      startTime,
      durationMinutes,
      priority: "medium",
    });

    if (scheduled.success) {
      result.created++;
    } else {
      result.skipped++;
      result.errors.push(`${date}: ${scheduled.error}`);
    }
  }

  return result;
}

export function removeFutureHabitBlocks(
  habitId: string,
  fromDate: string
): void {
  const store = usePlannerStore.getState();

  const matchingBlocks: PlannerBlock[] = store.blocks.filter(
    (block) =>
      block.source === "habit" &&
      block.sourceId === habitId &&
      block.date >= fromDate &&
      block.status === "planned"
  );

  matchingBlocks.forEach((block) => {
    usePlannerStore.getState().removeBlock(block.id);
  });
}