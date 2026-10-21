
import type {
  ActivityRecord,
  StreakSettings,
  StreakSummary,
} from "./streaks.types";

export function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function fromLocalDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);

  return new Date(year, month - 1, day, 12);
}

export function addDays(key: string, days: number): string {
  const date = fromLocalDateKey(key);
  date.setDate(date.getDate() + days);

  return toLocalDateKey(date);
}

export function calculateStreak(
  records: ActivityRecord[],
  settings: StreakSettings,
  goalId?: string,
  today = toLocalDateKey(new Date())
): StreakSummary {
  const dates = new Set(
    records
      .filter((record) => !goalId || record.goalId === goalId)
      .filter((record) => record.date <= today)
      .map((record) => record.date)
  );

  const sortedDates = [...dates].sort();

  const isRestDay = (dateKey: string) =>
    settings.restDays.includes(
      fromLocalDateKey(dateKey).getDay()
    );

  const isQualified = (dateKey: string) =>
    dates.has(dateKey) || isRestDay(dateKey);

  const activeToday = dates.has(today);

  function countBackwards(start: string): number {
    if (sortedDates.length === 0) return 0;

    let cursor = start;
    let count = 0;

    const earliest = sortedDates[0];

    while (cursor >= earliest) {
      if (!isQualified(cursor)) break;

      if (dates.has(cursor)) count++;

      cursor = addDays(cursor, -1);
    }

    return count;
  }

  // Si hoy aún no se ha registrado actividad,
  // permitimos que la racha siga vigente hasta
  // que termine el día.
  const start =
    activeToday || isRestDay(today)
      ? today
      : addDays(today, -1);

  const current = countBackwards(start);

  // Racha histórica: los descansos programados
  // mantienen la continuidad, pero no suman días.
  let longest = 0;
  let running = 0;
  let previous: string | null = null;

  for (const date of sortedDates) {
    if (previous === null) {
      running = 1;
    } else {
      let cursor = addDays(previous, 1);
      let uninterrupted = true;

      while (cursor < date) {
        if (!isRestDay(cursor)) {
          uninterrupted = false;
          break;
        }

        cursor = addDays(cursor, 1);
      }

      running = uninterrupted ? running + 1 : 1;
    }

    longest = Math.max(longest, running);
    previous = date;
  }

  return {
    current,
    longest,
    totalActiveDays: dates.size,
    activeToday,
  };
}

export function getWeekDates(
  today = new Date()
): string[] {
  const current = toLocalDateKey(today);
  const day = today.getDay();
  const mondayOffset = (day + 6) % 7;
  const monday = addDays(current, -mondayOffset);

  return Array.from(
    { length: 7 },
    (_, index) => addDays(monday, index)
  );
}
