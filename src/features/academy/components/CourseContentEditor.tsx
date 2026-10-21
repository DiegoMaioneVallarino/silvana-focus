
import { useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  ClipboardList,
} from "lucide-react";

import type {
  Course,
  Lesson,
  CreateLessonInput,
} from "../academy.types";

import { useAcademyStore } from "../academy.store";
import { LessonEditor } from "./LessonEditor";

interface CourseContentEditorProps {
  course: Course;
}

export function CourseContentEditor({
  course,
}: CourseContentEditorProps) {
  const addUnit = useAcademyStore(
    (state) => state.addUnit
  );
  const updateUnit = useAcademyStore(
    (state) => state.updateUnit
  );
  const deleteUnit = useAcademyStore(
    (state) => state.deleteUnit
  );
  const addLesson = useAcademyStore(
    (state) => state.addLesson
  );
  const updateLesson = useAcademyStore(
    (state) => state.updateLesson
  );
  const deleteLesson = useAcademyStore(
    (state) => state.deleteLesson
  );


  const [editingLesson, setEditingLesson] =
    useState<{
      unitId: string;
      lesson: Lesson | null;
    } | null>(null);

  function handleAddUnit() {
    const title = window.prompt(
      "Nombre de la nueva unidad:"
    );

    if (!title?.trim()) return;

    addUnit(course.id, title.trim(), "");
  }

  function handleRenameUnit(
    unitId: string,
    currentTitle: string
  ) {
    const title = window.prompt(
      "Nuevo nombre de la unidad:",
      currentTitle
    );

    if (!title?.trim()) return;

    updateUnit(course.id, unitId, {
      title: title.trim(),
    });
  }

  function handleSaveLesson(
    input: CreateLessonInput
  ) {
    if (!editingLesson) return;

    if (editingLesson.lesson) {
      updateLesson(
        course.id,
        editingLesson.unitId,
        editingLesson.lesson.id,
        input
      );
    } else {
      addLesson(
        course.id,
        editingLesson.unitId,
        input
      );
    }

    setEditingLesson(null);
  }

  if (editingLesson) {
    return (
      <LessonEditor
        key={
          editingLesson.lesson?.id ??
          `new-${editingLesson.unitId}`
        }
        initialLesson={
          editingLesson.lesson ?? undefined
        }
        onSave={handleSaveLesson}
        onCancel={() => setEditingLesson(null)}
      />
    );
  }

  return (
    <section className="sf-course-content-editor sf-card">
      <div className="sf-editor-section-header">
        <div>
          <h3>Contenido del curso</h3>
          <p className="sf-muted">
            Organiza las unidades y lecciones.
          </p>
        </div>

        <button
          className="sf-academy-primary"
          onClick={handleAddUnit}
        >
          <Plus size={16} />
          Nueva unidad
        </button>
      </div>

      {course.units.map((unit, index) => (
        <div
          className="sf-editor-unit"
          key={unit.id}
        >
          <div className="sf-editor-unit-header">
            <div>
              <span>UNIDAD {index + 1}</span>
              <h4>{unit.title}</h4>
            </div>

            <div className="sf-editor-actions">
              <button
                onClick={() =>
                  handleRenameUnit(
                    unit.id,
                    unit.title
                  )
                }
                title="Renombrar unidad"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "¿Eliminar esta unidad y sus lecciones?"
                    )
                  ) {
                    deleteUnit(course.id, unit.id);
                  }
                }}
                title="Eliminar unidad"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="sf-editor-lessons">
            {unit.lessons.map((lesson) => {
              const Icon =
                lesson.type === "quiz"
                  ? ClipboardList
                  : BookOpen;

              return (
                <div
                  key={lesson.id}
                  className="sf-editor-lesson"
                >
                  <Icon
                    size={18}
                    color="#873cff"
                  />

                  <div>
                    <strong>{lesson.title}</strong>
                    <span>
                      {lesson.type === "quiz"
                        ? "Evaluación"
                        : "Lectura"}
                    </span>
                  </div>

                  <div className="sf-editor-actions">
                    <button
                      onClick={() =>
                        setEditingLesson({
                          unitId: unit.id,
                          lesson,
                        })
                      }
                      title="Editar lección"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "¿Eliminar esta lección?"
                          )
                        ) {
                          deleteLesson(
                            course.id,
                            unit.id,
                            lesson.id
                          );
                        }
                      }}
                      title="Eliminar lección"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className="sf-academy-secondary"
            onClick={() =>
              setEditingLesson({
                unitId: unit.id,
                lesson: null,
              })
            }
          >
            <Plus size={16} />
            Agregar lección
          </button>
        </div>
      ))}

      {course.units.length === 0 && (
        <p className="sf-muted">
          Este curso todavía no tiene unidades.
        </p>
      )}
    </section>
  );
}
