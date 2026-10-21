
import type {
  AcademyUnit,
  CourseProgress,
  QuizAttempt,
  UnitMastery,
  MasteryStatus,
} from "./academy.types";

export function calculateUnitMastery(
  unit: AcademyUnit,
  progress?: CourseProgress,
  attempts: QuizAttempt[] = []
): UnitMastery {
  const completedLessons = unit.lessons.filter(
    (lesson) => !!progress?.lessons[lesson.id]
  ).length;

  const quizzes = unit.lessons.filter(
    (lesson) => lesson.type === "quiz"
  );

  const quizScores = quizzes
    .map((lesson) => {
      const lessonAttempts = attempts
        .filter(
          (attempt) =>
            attempt.lessonId === lesson.id
        )
        .map((attempt) => attempt.score);

      return lessonAttempts.length
        ? Math.max(...lessonAttempts)
        : null;
    })
    .filter(
      (score): score is number =>
        score !== null
    );

  const averageQuizScore =
    quizScores.length > 0
      ? Math.round(
          quizScores.reduce(
            (sum, score) => sum + score,
            0
          ) / quizScores.length
        )
      : null;

  let status: MasteryStatus = "not_started";

  if (completedLessons > 0 || quizScores.length > 0) {
    status = "learning";
  }

  if (quizScores.length > 0) {
    status = "practicing";
  }

  const allLessonsCompleted =
    unit.lessons.length > 0 &&
    completedLessons === unit.lessons.length;

  const allQuizzesMastered =
    quizzes.length === 0 ||
    (
      quizScores.length === quizzes.length &&
      averageQuizScore !== null &&
      averageQuizScore >= 85
    );

  if (allLessonsCompleted && allQuizzesMastered) {
    status = "mastered";
  }

  return {
    unitId: unit.id,
    title: unit.title,
    completedLessons,
    totalLessons: unit.lessons.length,
    averageQuizScore,
    status,
  };
}
