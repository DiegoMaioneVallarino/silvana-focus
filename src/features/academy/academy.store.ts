
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  Course,
  CourseProgress,
  CreateCourseInput,
  CreateLessonInput,
  AcademyUnit,
  QuizAttempt,
} from "./academy.types";

import { initialCourses } from "./academy.data";

import {
  getCourseLessons,
  isLessonUnlocked,
} from "./academy.utils";
import {
  removeAcademyCourseBlocks,
  removeAcademyLessonBlocks,
} from "../planner/planner.academy";


interface QuizResult {
  score: number;
  passed: boolean;
}

interface AcademyState {
  courses: Course[];
  progress: Record<string, CourseProgress>;
  attempts: QuizAttempt[];

  createCourse: (
    input: CreateCourseInput
  ) => string;

  updateCourse: (
    courseId: string,
    changes: Partial<CreateCourseInput>
  ) => void;

  deleteCourse: (
    courseId: string
  ) => void;

  addUnit: (
    courseId: string,
    title: string,
    description: string
  ) => void;

  updateUnit: (
    courseId: string,
    unitId: string,
    changes: Partial<
      Pick<
        AcademyUnit,
        "title" | "description"
      >
    >
  ) => void;

  deleteUnit: (
    courseId: string,
    unitId: string
  ) => void;

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

  submitQuiz: (
    courseId: string,
    lessonId: string,
    answers: Record<string, number>
  ) => QuizResult | null;
}

function updateCourseUnits(
  courses: Course[],
  courseId: string,
  updater: (
    units: AcademyUnit[]
  ) => AcademyUnit[]
): Course[] {
  return courses.map((course) =>
    course.id === courseId
      ? {
          ...course,
          units: updater(course.units),
        }
      : course
  );
}

function removeProgressForLessons(
  progress: Record<
    string,
    CourseProgress
  >,
  courseId: string,
  lessonIds: string[]
): Record<string, CourseProgress> {
  const courseProgress = progress[courseId];

  if (!courseProgress) {
    return progress;
  }

  const lessons = {
    ...courseProgress.lessons,
  };

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

export const useAcademyStore =
  create<AcademyState>()(
    persist(
      (set, get) => ({
        courses: initialCourses,
        progress: {},
        attempts: [],

        createCourse: (input) => {
          const id = crypto.randomUUID();

          set((state) => ({
            courses: [
              ...state.courses,
              {
                ...input,
                id,
                units: [],
                createdAt:
                  new Date().toISOString(),
              },
            ],
          }));

          return id;
        },

        updateCourse: (
          courseId,
          changes
        ) =>
          set((state) => ({
            courses: state.courses.map(
              (course) =>
                course.id === courseId
                  ? {
                      ...course,
                      ...changes,
                    }
                  : course
            ),
          })),

        deleteCourse: (courseId) =>
          set((state) => {
            const progress = {
              ...state.progress,
            };

            delete progress[courseId];

            return {
              courses: state.courses.filter(
                (course) =>
                  course.id !== courseId
              ),
              progress,
              attempts: state.attempts.filter(
                (attempt) =>
                  attempt.courseId !==
                  courseId
              ),
            };
          }),

        addUnit: (
          courseId,
          title,
          description
        ) =>
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

        updateUnit: (
          courseId,
          unitId,
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
                        ...changes,
                      }
                    : unit
                )
            ),
          })),

        deleteUnit: (
          courseId,
          unitId
        ) =>
          set((state) => {
            const course =
              state.courses.find(
                (item) =>
                  item.id === courseId
              );

            const unit =
              course?.units.find(
                (item) =>
                  item.id === unitId
              );

            const removedIds =
              unit?.lessons.map(
                (lesson) => lesson.id
              ) ?? [];

            return {
              courses: updateCourseUnits(
                state.courses,
                courseId,
                (units) =>
                  units.filter(
                    (unit) =>
                      unit.id !== unitId
                  )
              ),

              progress:
                removeProgressForLessons(
                  state.progress,
                  courseId,
                  removedIds
                ),

              attempts:
                state.attempts.filter(
                  (attempt) =>
                    !(
                      attempt.courseId ===
                        courseId &&
                      removedIds.includes(
                        attempt.lessonId
                      )
                    )
                ),
            };
          }),

        addLesson: (
          courseId,
          unitId,
          input
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
                        lessons:
                          unit.lessons.map(
                            (lesson) =>
                              lesson.id ===
                              lessonId
                                ? {
                                    ...lesson,
                                    ...changes,
                                  }
                                : lesson
                          ),
                      }
                    : unit
                )
            ),
          })),

        deleteLesson: (
          courseId,
          unitId,
          lessonId
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
                        lessons:
                          unit.lessons.filter(
                            (lesson) =>
                              lesson.id !==
                              lessonId
                          ),
                      }
                    : unit
                )
            ),

            progress:
              removeProgressForLessons(
                state.progress,
                courseId,
                [lessonId]
              ),

            attempts:
              state.attempts.filter(
                (attempt) =>
                  !(
                    attempt.courseId ===
                      courseId &&
                    attempt.lessonId ===
                      lessonId
                  )
              ),
          })),

        completeLesson: (
          courseId,
          lessonId,
          score = 100
        ) => {
          const state = get();

          const course =
            state.courses.find(
              (item) =>
                item.id === courseId
            );

          if (!course) return false;

          const lesson =
            getCourseLessons(
              course
            ).find(
              (item) =>
                item.id === lessonId
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

          // Los cuestionarios se completan
          // exclusivamente mediante submitQuiz.
          if (lesson.type === "quiz") {
            return false;
          }

          const previous =
            state.progress[courseId]
              ?.lessons[lessonId];

          const now =
            new Date().toISOString();

          set((current) => ({
            progress: {
              ...current.progress,
              [courseId]: {
                courseId,
                lessons: {
                  ...(
                    current.progress[
                      courseId
                    ]?.lessons ?? {}
                  ),
                  [lessonId]: {
                    lessonId,
                    completedAt:
                      previous?.completedAt ??
                      now,
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

        // Compatibilidad temporal.
        // Los cuestionarios nuevos
        // deben usar submitQuiz.
        recordQuizAttempt: (
          _courseId,
          _lessonId,
          _score
        ) => {
          return false;
        },

        submitQuiz: (
          courseId,
          lessonId,
          answers
        ) => {
          const state = get();

          const course =
            state.courses.find(
              (item) =>
                item.id === courseId
            );

          if (!course) return null;

          const lesson =
            getCourseLessons(
              course
            ).find(
              (item) =>
                item.id === lessonId
            );

          if (
            !lesson ||
            lesson.type !== "quiz" ||
            lesson.questions.length === 0
          ) {
            return null;
          }

          if (
            !isLessonUnlocked(
              course,
              lessonId,
              state.progress[courseId]
            )
          ) {
            return null;
          }

          const allAnswered =
            lesson.questions.every(
              (question) => {
                const answer =
                  answers[question.id];

                return (
                  Number.isInteger(answer) &&
                  answer >= 0 &&
                  answer <
                    question.options.length
                );
              }
            );

          if (!allAnswered) {
            return null;
          }

          const correct =
            lesson.questions.filter(
              (question) =>
                answers[question.id] ===
                question.correctOption
            ).length;

          const score = Math.round(
            (correct /
              lesson.questions.length) *
              100
          );

          const passed =
            score >= lesson.passingScore;

          const now =
            new Date().toISOString();

          const attempt: QuizAttempt = {
            id: crypto.randomUUID(),
            courseId,
            lessonId,
            score,
            passed,
            answers: { ...answers },
            completedAt: now,
          };

          set((current) => {
            const previous =
              current.progress[courseId]
                ?.lessons[lessonId];

            const nextProgress =
              passed
                ? {
                    ...current.progress,
                    [courseId]: {
                      courseId,
                      lessons: {
                        ...(
                          current.progress[
                            courseId
                          ]?.lessons ?? {}
                        ),
                        [lessonId]: {
                          lessonId,
                          completedAt:
                            previous?.completedAt ??
                            now,
                          bestScore:
                            Math.max(
                              previous?.bestScore ??
                                0,
                              score
                            ),
                          attempts:
                            (
                              previous?.attempts ??
                              0
                            ) + 1,
                        },
                      },
                    },
                  }
                : current.progress;

            return {
              attempts: [
                ...(current.attempts ?? []),
                attempt,
              ],
              progress: nextProgress,
            };
          });

          return {
            score,
            passed,
          };
        },
      }),
      {
        name: "silvana-academy",
      }
    )
  );
