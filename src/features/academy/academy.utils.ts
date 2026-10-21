
import type {
  Course,
  Lesson,
  CourseProgress,
  QuizQuestion,
} from "./academy.types";

export function getCourseLessons(
  course: Course
): Lesson[] {
  return course.units.flatMap((unit) => unit.lessons);
}

export function getCourseCompletion(
  course: Course,
  progress?: CourseProgress
): number {
  const lessons = getCourseLessons(course);

  if (lessons.length === 0) return 0;

  const completed = lessons.filter(
    (lesson) => !!progress?.lessons[lesson.id]
  ).length;

  return Math.round(
    (completed / lessons.length) * 100
  );
}

export function isLessonUnlocked(
  course: Course,
  lessonId: string,
  progress?: CourseProgress
): boolean {
  const lessons = getCourseLessons(course);
  const index = lessons.findIndex(
    (lesson) => lesson.id === lessonId
  );

  if (index < 0) return false;
  if (index === 0) return true;

  if (progress?.lessons[lessonId]) {
    return true;
  }

  const previousLesson = lessons[index - 1];

  return !!progress?.lessons[previousLesson.id];
}

export function getLessonStatus(
  course: Course,
  lessonId: string,
  progress?: CourseProgress
): "completed" | "available" | "locked" {
  if (progress?.lessons[lessonId]) {
    return "completed";
  }

  return isLessonUnlocked(course, lessonId, progress)
    ? "available"
    : "locked";
}

export function gradeQuiz(
  questions: QuizQuestion[],
  answers: Record<string, number>
): number {
  if (questions.length === 0) return 0;

  const correct = questions.filter(
    (question) =>
      answers[question.id] === question.correctOption
  ).length;

  return Math.round(
    (correct / questions.length) * 100
  );
}

export function getCourseUnitCount(
  course: Course
): number {
  return course.units.length;
}
