
import { usePlannerStore } from "./planner.store";
import { scheduleSource } from "./planner.sync";

import type {
  Course,
  Lesson,
} from "../academy/academy.types";

export interface AcademyScheduleInput {
  course: Course;
  lesson: Lesson;
  date: string;
  startTime: string;
  durationMinutes: number;
}

export type AcademyScheduleResult =
  | { success: true; blockId: string }
  | { success: false; error: string };

export function scheduleAcademyLesson({
  course,
  lesson,
  date,
  startTime,
  durationMinutes,
}: AcademyScheduleInput): AcademyScheduleResult {
  const belongsToCourse = course.units.some((unit) =>
    unit.lessons.some((item) => item.id === lesson.id)
  );

  if (!belongsToCourse) {
    return {
      success: false,
      error: "La lección no pertenece al curso seleccionado.",
    };
  }

  return scheduleSource({
    source: "academy",
    sourceId: lesson.id,
    title: `${course.emoji} ${course.title} · ${lesson.title}`,
    date,
    startTime,
    durationMinutes,
    priority: "medium",
  });
}

export function removeAcademyLessonBlocks(
  lessonId: string
): void {
  const blocks = usePlannerStore
    .getState()
    .blocks.filter(
      (block) =>
        block.source === "academy" &&
        block.sourceId === lessonId
    );

  blocks.forEach((block) => {
    usePlannerStore.getState().removeBlock(block.id);
  });
}

export function removeAcademyCourseBlocks(
  course: Course
): void {
  course.units.forEach((unit) => {
    unit.lessons.forEach((lesson) => {
      removeAcademyLessonBlocks(lesson.id);
    });
  });
}
