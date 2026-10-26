
import type { Task } from "../tasks/tasks.types";
import type { Habit } from "../habits/habits.types";
import type {
  Course,
  CourseProgress,
} from "../academy/academy.types";

import {
  isLessonUnlocked,
} from "../academy/academy.utils";

import type {
  PlannerBlock,
} from "./planner.types";

import type {
  PlannerCandidate,
} from "./planner.priorities";

import type {
  PlannerPreferences,
} from "./planner.preferences.store";

export interface PlannerCandidateSources {
  tasks: Task[];
  habits: Habit[];
  courses: Course[];
  progress: Record<string, CourseProgress>;
  blocks: PlannerBlock[];
  date: string;
  preferences: PlannerPreferences;
}

function getLocalDateKey(value: Date): string {
  const year = value.getFullYear();
  const month = String(
    value.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    value.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateWeekday(
  date: string
): number {
  const [year, month, day] = date
    .split("-")
    .map(Number);

  return new Date(
    year,
    month - 1,
    day
  ).getDay();
}

export function getPlannerCandidates({
  tasks,
  habits,
  courses,
  progress,
  blocks,
  date,
  preferences,
}: PlannerCandidateSources): PlannerCandidate[] {
  const candidates: PlannerCandidate[] = [];

  // No duplicar actividades ya programadas.
  const scheduledKeys = new Set(
    blocks
      .filter(
        (block) =>
          block.date === date &&
          block.status !== "skipped" &&
          block.sourceId !== null
      )
      .map(
        (block) =>
          `${block.source}:${block.sourceId}`
      )
  );

  // TAREAS
  for (const task of tasks) {
    if (task.status === "completed") {
      continue;
    }

    if (
      scheduledKeys.has(`task:${task.id}`)
    ) {
      continue;
    }

    candidates.push({
      id: `task:${task.id}`,
      title: task.title,
      source: "task",
      sourceId: task.id,
      priority: task.priority,
      durationMinutes: 45,
      dueDate: task.dueDate,
      goalImportance: task.goalId ? 3 : 0,
      createdAt: task.createdAt,
    });
  }

  // HÁBITOS
  for (const habit of habits) {
    if (habit.archivedAt) {
      continue;
    }

    const createdDate = getLocalDateKey(
      new Date(habit.createdAt)
    );

    if (date < createdDate) {
      continue;
    }

    const scheduled =
      habit.frequency === "daily" ||
      habit.daysOfWeek.includes(
        getDateWeekday(date)
      );

    if (!scheduled) {
      continue;
    }

    if (
      habit.completedDates.includes(date)
    ) {
      continue;
    }

    if (
      scheduledKeys.has(`habit:${habit.id}`)
    ) {
      continue;
    }

    candidates.push({
      id: `habit:${habit.id}`,
      title: `${habit.emoji} ${habit.title}`,
      source: "habit",
      sourceId: habit.id,
      priority: "medium",
      durationMinutes: 30,
      goalImportance: habit.goalId ? 3 : 0,
      createdAt: habit.createdAt,
    });
  }

  // ACADEMIA
  for (const course of courses) {
    const courseProgress =
      progress[course.id];

    for (const unit of course.units) {
      for (const lesson of unit.lessons) {
        if (
          courseProgress?.lessons[lesson.id]
        ) {
          continue;
        }

        if (
          !isLessonUnlocked(
            course,
            lesson.id,
            courseProgress
          )
        ) {
          continue;
        }

        if (
          scheduledKeys.has(
            `academy:${lesson.id}`
          )
        ) {
          continue;
        }

        candidates.push({
          id: `academy:${lesson.id}`,
          title:
            `${course.emoji} ${course.title}` +
            ` · ${lesson.title}`,
          source: "academy",
          sourceId: lesson.id,
          priority: "medium",
          durationMinutes:
            lesson.type === "quiz"
              ? 30
              : 45,
          goalImportance:
            course.goalId ? 3 : 0,
          createdAt: course.createdAt,
        });
      }
    }
  }

  return candidates;
}
