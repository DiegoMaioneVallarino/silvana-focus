
import { useState } from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Settings2,
  Trash2,
} from "lucide-react";

import type {
  Lesson,
} from "../features/academy/academy.types";

import { useAcademyStore } from "../features/academy/academy.store";

import {
  getCourseCompletion,
  isLessonUnlocked,
} from "../features/academy/academy.utils";

import { LearningPath } from "../features/academy/components/LearningPath";
import { LessonViewer } from "../features/academy/components/LessonViewer";
import { QuizViewer } from "../features/academy/components/QuizViewer";
import { CourseContentEditor } from "../features/academy/components/CourseContentEditor";
import { CourseMastery } from "../features/academy/components/CourseMastery";

import "./AcademyPage.css";

export function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const courses = useAcademyStore(
    (state) => state.courses
  );

  const progress = useAcademyStore(
    (state) => state.progress
  );

  const deleteCourse = useAcademyStore(
    (state) => state.deleteCourse
  );

  const completeLesson = useAcademyStore(
    (state) => state.completeLesson
  );

  const submitQuiz = useAcademyStore(
    (state) => state.submitQuiz
  );

  const [selectedLesson, setSelectedLesson] =
    useState<Lesson | null>(null);

  const [editorOpen, setEditorOpen] =
    useState(false);

  const course = courses.find(
    (item) => item.id === courseId
  );

  if (!course) {
    return (
      <div className="sf-academy-page">
        <h2>Curso no encontrado</h2>

        <Link
          to="/academy"
          className="sf-academy-back"
        >
          <ArrowLeft size={17} />
          Volver a la Academia
        </Link>
      </div>
    );
  }

  const courseProgress = progress[course.id];

  const percentage = getCourseCompletion(
    course,
    courseProgress
  );

  return (
    <div className="sf-academy-page">
      <Link
        to="/academy"
        className="sf-academy-back"
      >
        <ArrowLeft size={17} />
        Volver a la Academia
      </Link>

      <header className="sf-course-detail-header sf-card">
        <div
          className="sf-course-detail-icon"
          style={{
            background: `${course.color}18`,
          }}
        >
          {course.emoji}
        </div>

        <div>
          <h2>{course.title}</h2>

          <p>{course.description}</p>

          <div className="sf-course-progress">
            <div
              style={{
                width: `${percentage}%`,
                background: course.color,
              }}
            />
          </div>

          <small>
            {percentage}% completado
          </small>
        </div>

        <button
          type="button"
          className="sf-academy-secondary"
          onClick={() => {
            setEditorOpen(!editorOpen);
            setSelectedLesson(null);
          }}
        >
          <Settings2 size={17} />

          {editorOpen
            ? "Ver curso"
            : "Editar contenido"}
        </button>
      </header>

      {editorOpen ? (
        <>
          <CourseContentEditor
            course={course}
          />

          <button
            type="button"
            className="sf-academy-danger"
            onClick={() => {
              if (
                window.confirm(
                  "¿Eliminar este curso y todo su progreso?"
                )
              ) {
                deleteCourse(course.id);
                navigate("/academy");
              }
            }}
          >
            <Trash2 size={16} />
            Eliminar curso
          </button>
        </>
      ) : selectedLesson ? (
        selectedLesson.type === "quiz" ? (
          <QuizViewer
            key={selectedLesson.id}
            lesson={selectedLesson}
            onSubmit={(answers) =>
              submitQuiz(
                course.id,
                selectedLesson.id,
                answers
              )
            }
            onClose={() =>
              setSelectedLesson(null)
            }
          />
        ) : (
          <LessonViewer
            key={selectedLesson.id}
            lesson={selectedLesson}
            onComplete={() => {
              completeLesson(
                course.id,
                selectedLesson.id
              );

              setSelectedLesson(null);
            }}
            onClose={() =>
              setSelectedLesson(null)
            }
          />
        )
      ) : (
        <LearningPath
          course={course}
          progress={courseProgress}
          onSelectLesson={(lesson) => {
            if (
              isLessonUnlocked(
                course,
                lesson.id,
                courseProgress
              )
            ) {
              setSelectedLesson(lesson);
            }
          }}
        />
      )}

      {!editorOpen && (
        <CourseMastery
          course={course}
        />
      )}
    </div>
  );
}
