
import type { ActivitySession } from "../activity/activity.types";
import type { Task } from "../tasks/tasks.types";
import type { Habit } from "../habits/habits.types";
import type { Project } from "../projects/projects.types";
import type { XPReward } from "../progression/progression.types";

import type {
  StatisticsPeriod,
  DailyFocusData,
  ProductivityStats,
  CategoryTimeData,
} from "./statistics.types";

import {
  addDays,
  fromLocalDateKey,
  toLocalDateKey,
} from "../streaks/streaks.utils";

import {
  getHabitStartDate,
  isHabitScheduled,
} from "../habits/habits.utils";

export function getPeriodStart(
  period: StatisticsPeriod,
  today = toLocalDateKey(new Date())
): string | null {
  if (period === "all") return null;

  return addDays(
    today,
    period === "week" ? -6 : -29
  );
}

function isWithinPeriod(
  date: string,
  start: string | null,
  today: string
): boolean {
  return date <= today && (!start || date >= start);
}

export function getDailyFocusData(
  sessions: ActivitySession[],
  period: StatisticsPeriod
): DailyFocusData[] {
  const today = toLocalDateKey(new Date());
  const days = period === "month" ? 30 : 7;
  const start = addDays(today, -(days - 1));

  return Array.from({ length: days }, (_, index) => {
    const date = addDays(start, index);

    const dailySessions = sessions.filter(
      (session) =>
        toLocalDateKey(
          new Date(session.endedAt)
        ) === date
    );

    return {
      date,
      label: fromLocalDateKey(date)
        .toLocaleDateString("es-MX", {
          weekday: "short",
          day: period === "month"
            ? "numeric"
            : undefined,
        }),
      seconds: dailySessions.reduce(
        (sum, session) =>
          sum + session.durationSeconds,
        0
      ),
      sessions: dailySessions.length,
    };
  });
}

export function getProductivityStats(
  sessions: ActivitySession[],
  tasks: Task[],
  habits: Habit[],
  projects: Project[],
  rewards: XPReward[],
  period: StatisticsPeriod
): ProductivityStats {
  const today = toLocalDateKey(new Date());
  const start = getPeriodStart(period, today);

  const periodSessions = sessions.filter(
    (session) =>
      isWithinPeriod(
        toLocalDateKey(new Date(session.endedAt)),
        start,
        today
      )
  );

  const completedTasks = tasks.filter(
    (task) =>
      task.status === "completed" &&
      task.completedAt &&
      isWithinPeriod(
        toLocalDateKey(new Date(task.completedAt)),
        start,
        today
      )
  ).length;

  const completedProjects = projects.filter(
    (project) =>
      project.status === "completed" &&
      project.completedAt &&
      isWithinPeriod(
        toLocalDateKey(new Date(project.completedAt)),
        start,
        today
      )
  ).length;

  let completedHabitChecks = 0;
  let scheduledHabitChecks = 0;

  for (const habit of habits) {
    const habitStart = getHabitStartDate(habit);
    const archivedDate = habit.archivedAt
      ? toLocalDateKey(new Date(habit.archivedAt))
      : today;

    const firstDate =
      start && start > habitStart
        ? start
        : habitStart;

    const lastDate =
      archivedDate < today
        ? archivedDate
        : today;

    const completed = new Set(habit.completedDates);

    for (
      let date = firstDate;
      date <= lastDate;
      date = addDays(date, 1)
    ) {
      if (!isHabitScheduled(habit, date)) {
        continue;
      }

      scheduledHabitChecks++;

      if (completed.has(date)) {
        completedHabitChecks++;
      }
    }
  }

  const earnedXP = rewards.reduce(
    (sum, reward) => {
      if (!reward.active) return sum;

      const date = toLocalDateKey(
        new Date(reward.awardedAt)
      );

      return isWithinPeriod(date, start, today)
        ? sum + reward.amount
        : sum;
    },
    0
  );

  return {
    totalFocusSeconds: periodSessions.reduce(
      (sum, session) =>
        sum + session.durationSeconds,
      0
    ),
    completedTasks,
    totalTasks: tasks.length,
    completedHabitChecks,
    scheduledHabitChecks,
    completedProjects,
    totalProjects: projects.length,
    earnedXP,
  };
}

export function getCategoryTimeData(
  sessions: ActivitySession[],
  period: StatisticsPeriod
): CategoryTimeData[] {
  const today = toLocalDateKey(new Date());
  const start = getPeriodStart(period, today);

  const filtered = sessions.filter(
    (session) =>
      isWithinPeriod(
        toLocalDateKey(new Date(session.endedAt)),
        start,
        today
      )
  );

  const totals = new Map<string, number>();

  for (const session of filtered) {
    totals.set(
      session.category,
      (totals.get(session.category) ?? 0) +
        session.durationSeconds
    );
  }

  const totalSeconds = Array.from(
    totals.values()
  ).reduce((sum, seconds) => sum + seconds, 0);

  return Array.from(totals.entries())
    .map(([category, seconds]) => ({
      category,
      seconds,
      percentage:
        totalSeconds === 0
          ? 0
          : Math.round(
              (seconds / totalSeconds) * 100
            ),
    }))
    .sort((a, b) => b.seconds - a.seconds);
}

export function formatStatisticsDuration(
  seconds: number
): string {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  return `${hours}h ${remainingMinutes}m`;
}
