
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

import type { FormEvent } from "react";

import type {
  Lesson,
  CreateLessonInput,
} from "../features/academy/academy.types";

import { useAcademyStore } from "../features/academy/academy.store";

import {
  getCourseCompletion,
  isLessonUnlocked,
} from "../features/academy/academy.utils";

import { LearningPath } from "../features/academy/components/LearningPath";
import { LessonViewer } from "../features/academy/components/LessonViewer";
import { QuizViewer } from "../features/academy/components/QuizViewer";

import "./AcademyPage.css";

export function CoursePage() {
  const { courseId } = useParams();

  const courses = useAcademyStore(
    (state) => state.courses
  );
  const progress = useAcademyStore(
    (state) => state.progress
  );

  const addUnit = useAcademyStore(
    (state) => state.addUnit
  );
  const addLesson = useAcademyStore(
    (state) => state.addLesson
  );
  const deleteCourse = useAcademyStore(
    (state) => state.deleteCourse
  );
  const completeLesson = useAcademyStore(
    (state) => state.completeLesson
  );
  const recordQuizAttempt = useAcademyStore(
    (state) => state.recordQuizAttempt
  );

  const [selectedLesson, setSelectedLesson] =
    useState<Lesson | null>(null);

  const [unitTitle, setUnitTitle] = useState("");
  const [unitDescription, setUnitDescription] =
    useState("");

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] =
    useState("");
  const [selectedUnitId, setSelectedUnitId] =
    useState("");

  const course = courses.find(
    (item) => item.id === courseId
  );

  if (!course) {
    return (
      <div className="sf-academy-page">
        <h2>Curso no encontrado</h2>
        <Link to="/academy">
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

  function handleAddUnit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!unitTitle.trim()) return;

    addUnit(
      course!.id,
      unitTitle.trim(),
      unitDescription.trim()
    );

    setUnitTitle("");
    setUnitDescription("");
  }

  function handleAddLesson(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !selectedUnitId ||
      !lessonTitle.trim() ||
      !lessonContent.trim()
    ) {
      return;
    }

    const input: CreateLessonInput = {
      title: lessonTitle.trim(),
      description: "",
      type: "reading",
      content: lessonContent.trim(),
      questions: [],
      passingScore: 0,
    };

    addLesson(
      course!.id,
      selectedUnitId,
      input
    );

    setLessonTitle("");
    setLessonContent("");
  }

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

          <small>{percentage}% completado</small>
        </div>
      </header>

      {selectedLesson ? (
        selectedLesson.type === "quiz" ? (
          <QuizViewer
            key={selectedLesson.id}
            lesson={selectedLesson}
            onSubmit={(score) =>
              recordQuizAttempt(
                course.id,
                selectedLesson.id,
                score
              )
            }
            onClose={() => setSelectedLesson(null)}
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
            onClose={() => setSelectedLesson(null)}
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

      <section className="sf-academy-editor sf-card">
        <h3>Administrar contenido</h3>

        <form onSubmit={handleAddUnit}>
          <h4>Nueva unidad</h4>

          <input
            placeholder="Nombre de la unidad"
            value={unitTitle}
            onChange={(event) =>
              setUnitTitle(event.target.value)
            }
            required
          />

          <input
            placeholder="Descripción"
            value={unitDescription}
            onChange={(event) =>
              setUnitDescription(event.target.value)
            }
          />

          <button className="sf-academy-primary">
            <Plus size={16} />
            Agregar unidad
          </button>
        </form>

        <form onSubmit={handleAddLesson}>
          <h4>Nueva lección de lectura</h4>

          <select
            value={selectedUnitId}
            onChange={(event) =>
              setSelectedUnitId(event.target.value)
            }
            required
          >
            <option value="">
              Selecciona una unidad
            </option>

            {course.units.map((unit) => (
              <option
                key={unit.id}
                value={unit.id}
              >
                {unit.title}
              </option>
            ))}
          </select>

          <input
            placeholder="Título de la lección"
            value={lessonTitle}
            onChange={(event) =>
              setLessonTitle(event.target.value)
            }
            required
          />

          <textarea
            rows={5}
            placeholder="Contenido de la lección"
            value={lessonContent}
            onChange={(event) =>
              setLessonContent(event.target.value)
            }
            required
          />

          <button className="sf-academy-primary">
            <Plus size={16} />
            Agregar lección
          </button>
        </form>

        <button
          className="sf-academy-danger"
          onClick={() => {
            if (
              window.confirm(
                "¿Eliminar este curso y todo su progreso?"
              )
            ) {
              deleteCourse(course.id);
              window.location.href = "/academy";
            }
          }}
        >
          <Trash2 size={16} />
          Eliminar curso
        </button>
      </section>
    </div>
  );
}
