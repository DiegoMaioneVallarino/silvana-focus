
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  Course,
  CourseProgress,
  CreateCourseInput,
  CreateLessonInput,
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

  deleteCourse: (courseId: string) => void;

  addUnit: (
    courseId: string,
    title: string,
    description: string
  ) => void;

  addLesson: (
    courseId: string,
    unitId: string,
    input: CreateLessonInput
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
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  units: [
                    ...course.units,
                    {
                      id: crypto.randomUUID(),
                      title,
                      description,
                      lessons: [],
                    },
                  ],
                }
              : course
          ),
        })),

      addLesson: (courseId, unitId, input) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  units: course.units.map((unit) =>
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
                  ),
                }
              : course
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

        const current = state.progress[courseId];

        if (
          !isLessonUnlocked(
            course,
            lessonId,
            current
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

        const previous = current?.lessons[lessonId];

        set((store) => ({
          progress: {
            ...store.progress,
            [courseId]: {
              courseId,
              lessons: {
                ...(store.progress[courseId]?.lessons ?? {}),
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
                    previous?.attempts ?? 1,
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

        const current = state.progress[courseId];

        if (
          !isLessonUnlocked(
            course,
            lessonId,
            current
          )
        ) {
          return false;
        }

        const previous = current?.lessons[lessonId];
        const passed = score >= lesson.passingScore;

        set((store) => ({
          progress: {
            ...store.progress,
            [courseId]: {
              courseId,
              lessons: {
                ...(store.progress[courseId]?.lessons ?? {}),
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
