
export type LessonType = "reading" | "quiz";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: LessonType;
  content: string;
  questions: QuizQuestion[];
  passingScore: number;
}

export interface AcademyUnit {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  goalId: string | null;
  units: AcademyUnit[];
  createdAt: string;
}

export interface LessonProgress {
  lessonId: string;
  completedAt: string;
  bestScore: number;
  attempts: number;
}

export interface CourseProgress {
  courseId: string;
  lessons: Record<string, LessonProgress>;
}

export type CreateCourseInput = Pick<
  Course,
  "title" | "description" | "emoji" | "color" | "goalId"
>;

export type CreateLessonInput = Omit<Lesson, "id">;
