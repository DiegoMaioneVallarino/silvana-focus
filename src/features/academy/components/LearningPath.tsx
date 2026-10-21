
import {
  Check,
  Lock,
  BookOpen,
  ClipboardList,
} from "lucide-react";

import type {
  Course,
  CourseProgress,
  Lesson,
} from "../academy.types";

import { getLessonStatus } from "../academy.utils";

interface LearningPathProps {
  course: Course;
  progress?: CourseProgress;
  onSelectLesson: (lesson: Lesson) => void;
}

export function LearningPath({
  course,
  progress,
  onSelectLesson,
}: LearningPathProps) {
  let lessonIndex = 0;

  return (
    <div className="sf-learning-path">
      {course.units.map((unit, unitIndex) => (
        <section
          key={unit.id}
          className="sf-learning-unit"
        >
          <div className="sf-learning-unit-header">
            <span>
              UNIDAD {unitIndex + 1}
            </span>

            <h3>{unit.title}</h3>
            <p>{unit.description}</p>
          </div>

          <div className="sf-learning-nodes">
            {unit.lessons.map((lesson) => {
              const index = lessonIndex++;

              const status = getLessonStatus(
                course,
                lesson.id,
                progress
              );

              const Icon =
                status === "completed"
                  ? Check
                  : status === "locked"
                    ? Lock
                    : lesson.type === "quiz"
                      ? ClipboardList
                      : BookOpen;

              return (
                <div
                  key={lesson.id}
                  className="sf-learning-node-wrapper"
                  style={{
                    transform: `translateX(${
                      [0, -55, 55, 0][index % 4]
                    }px)`,
                  }}
                >
                  <button
                    type="button"
                    disabled={status === "locked"}
                    className={`sf-learning-node ${status}`}
                    onClick={() =>
                      onSelectLesson(lesson)
                    }
                    title={lesson.title}
                  >
                    <Icon size={26} />
                  </button>

                  <strong>{lesson.title}</strong>

                  <span>
                    {status === "completed"
                      ? "Completada"
                      : status === "available"
                        ? "Disponible"
                        : "Bloqueada"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
