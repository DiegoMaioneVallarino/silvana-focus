
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  Course,
  CourseProgress,
  CreateCourseInput,
  CreateLessonInput,
  QuizQuestion,
  AcademyUnit,
  Lesson,
} from "./academy.types";

import { initialCourses } from "./academy.data";

import {
  getCourseLessons,
  isLessonUnlocked,
} from "./academy.utils";

interface AcademyState {
  courses: Course[];
  progress: Record<string, CourseProgress>;

  createCourse: (input: CreateCourseInput) => string;
  updateCourse: (
    courseId: string,
    changes: Partial<CreateCourseInput>
  ) => void;
  deleteCourse: (courseId: string) => void;

  addUnit: (
    courseId: string,
    title: string,
    description: string
  ) => void;
  updateUnit: (
    courseId: string,
    unitId: string,
    changes: Partial<Pick<AcademyUnit, "title" | "description">>
  ) => void;
  deleteUnit: (courseId: string, unitId: string) => void;

  addLesson: (
    courseId: string,
    unitId: string,
    input: CreateLessonInput
  ) => void;
  updateLesson: (
    courseId: string,
    unitId: string,
    lessonId: string,
    changes: Partial<CreateLessonInput>
  ) => void;
  deleteLesson: (
    courseId: string,
    unitId: string,
    lessonId: string
  ) => void;

  completeLesson: (
    courseId: string,
    lessonId: string,
    score?: number
  ) => boolean;
  recordQuizAttempt: (
    courseId: string,
    lessonId: string,
    score: number
  ) => boolean;
}

function updateCourseUnits(
  courses: Course[],
  courseId: string,
  updater: (units: AcademyUnit[]) => AcademyUnit[]
): Course[] {
  return courses.map((course) =>
    course.id === courseId
      ? { ...course, units: updater(course.units) }
      : course
  );
}

function removeProgressForLessons(
  progress: Record<string, CourseProgress>,
  courseId: string,
  lessonIds: string[]
): Record<string, CourseProgress> {
  const courseProgress = progress[courseId];
  if (!courseProgress) return progress;

  const lessons = { ...courseProgress.lessons };

  for (const id of lessonIds) {
    delete lessons[id];
  }

  return {
    ...progress,
    [courseId]: {
      ...courseProgress,
      lessons,
    },
  };
}

export const useAcademyStore = create<AcademyState>()(
  persist(
    (set, get) => ({
      courses: initialCourses,
      progress: {},

      createCourse: (input) => {
        const id = crypto.randomUUID();

        set((state) => ({
          courses: [
            ...state.courses,
            {
              ...input,
              id,
              units: [],
              createdAt: new Date().toISOString(),
            },
          ],
        }));

        return id;
      },

      updateCourse: (courseId, changes) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? { ...course, ...changes }
              : course
          ),
        })),

      deleteCourse: (courseId) =>
        set((state) => {
          const progress = { ...state.progress };
          delete progress[courseId];

          return {
            courses: state.courses.filter(
              (course) => course.id !== courseId
            ),
            progress,
          };
        }),

      addUnit: (courseId, title, description) =>
        set((state) => ({
          courses: updateCourseUnits(
            state.courses,
            courseId,
            (units) => [
              ...units,
              {
                id: crypto.randomUUID(),
                title,
                description,
                lessons: [],
              },
            ]
          ),
        })),

      updateUnit: (courseId, unitId, changes) =>
        set((state) => ({
          courses: updateCourseUnits(
            state.courses,
            courseId,
            (units) =>
              units.map((unit) =>
                unit.id === unitId
                  ? { ...unit, ...changes }
                  : unit
              )
          ),
        })),

      deleteUnit: (courseId, unitId) =>
        set((state) => {
          const course = state.courses.find(
            (item) => item.id === courseId
          );

          const unit = course?.units.find(
            (item) => item.id === unitId
          );

          const removedIds =
            unit?.lessons.map((lesson) => lesson.id) ?? [];

          return {
            courses: updateCourseUnits(
              state.courses,
              courseId,
              (units) =>
                units.filter((unit) => unit.id !== unitId)
            ),
            progress: removeProgressForLessons(
              state.progress,
              courseId,
              removedIds
            ),
          };
        }),

      addLesson: (courseId, unitId, input) =>
        set((state) => ({
          courses: updateCourseUnits(
            state.courses,
            courseId,
            (units) =>
              units.map((unit) =>
                unit.id === unitId
                  ? {
                      ...unit,
                      lessons: [
                        ...unit.lessons,
                        {
                          ...input,
                          id: crypto.randomUUID(),
                        },
                      ],
                    }
                  : unit
              )
          ),
        })),

      updateLesson: (
        courseId,
        unitId,
        lessonId,
        changes
      ) =>
        set((state) => ({
          courses: updateCourseUnits(
            state.courses,
            courseId,
            (units) =>
              units.map((unit) =>
                unit.id === unitId
                  ? {
                      ...unit,
                      lessons: unit.lessons.map(
                        (lesson) =>
                          lesson.id === lessonId
                            ? { ...lesson, ...changes }
                            : lesson
                      ),
                    }
                  : unit
              )
          ),
        })),

      deleteLesson: (courseId, unitId, lessonId) =>
        set((state) => ({
          courses: updateCourseUnits(
            state.courses,
            courseId,
            (units) =>
              units.map((unit) =>
                unit.id === unitId
                  ? {
                      ...unit,
                      lessons: unit.lessons.filter(
                        (lesson) =>
                          lesson.id !== lessonId
                      ),
                    }
                  : unit
              )
          ),
          progress: removeProgressForLessons(
            state.progress,
            courseId,
            [lessonId]
          ),
        })),

      completeLesson: (
        courseId,
        lessonId,
        score = 100
      ) => {
        const state = get();
        const course = state.courses.find(
          (item) => item.id === courseId
        );

        if (!course) return false;

        const lesson = getCourseLessons(course).find(
          (item) => item.id === lessonId
        );

        if (!lesson) return false;

        if (
          !isLessonUnlocked(
            course,
            lessonId,
            state.progress[courseId]
          )
        ) {
          return false;
        }

        if (
          lesson.type === "quiz" &&
          score < lesson.passingScore
        ) {
          return false;
        }

        const previous =
          state.progress[courseId]?.lessons[lessonId];

        set((current) => ({
          progress: {
            ...current.progress,
            [courseId]: {
              courseId,
              lessons: {
                ...(current.progress[courseId]?.lessons ?? {}),
                [lessonId]: {
                  lessonId,
                  completedAt:
                    previous?.completedAt ??
                    new Date().toISOString(),
                  bestScore: Math.max(
                    previous?.bestScore ?? 0,
                    score
                  ),
                  attempts: previous?.attempts ?? 1,
                },
              },
            },
          },
        }));

        return true;
      },

      recordQuizAttempt: (
        courseId,
        lessonId,
        score
      ) => {
        const state = get();

        const course = state.courses.find(
          (item) => item.id === courseId
        );

        if (!course) return false;

        const lesson = getCourseLessons(course).find(
          (item) => item.id === lessonId
        );

        if (!lesson || lesson.type !== "quiz") {
          return false;
        }

        if (
          !isLessonUnlocked(
            course,
            lessonId,
            state.progress[courseId]
          )
        ) {
          return false;
        }

        const previous =
          state.progress[courseId]?.lessons[lessonId];

        const passed = score >= lesson.passingScore;

        set((current) => ({
          progress: {
            ...current.progress,
            [courseId]: {
              courseId,
              lessons: {
                ...(current.progress[courseId]?.lessons ?? {}),
                ...(previous || passed
                  ? {
                      [lessonId]: {
                        lessonId,
                        completedAt:
                          previous?.completedAt ??
                          new Date().toISOString(),
                        bestScore: Math.max(
                          previous?.bestScore ?? 0,
                          score
                        ),
                        attempts:
                          (previous?.attempts ?? 0) + 1,
                      },
                    }
                  : {}),
              },
            },
          },
        }));

        return passed;
      },
    }),
    {
      name: "silvana-academy",
    }
  )
);
