
import { useState } from "react";
import type { FormEvent } from "react";

import type {
  Lesson,
  CreateLessonInput,
  LessonType,
  QuizQuestion,
} from "../academy.types";

import { QuestionEditor } from "./QuestionEditor";

interface LessonEditorProps {
  initialLesson?: Lesson;
  onSave: (input: CreateLessonInput) => void;
  onCancel: () => void;
}

export function LessonEditor({
  initialLesson,
  onSave,
  onCancel,
}: LessonEditorProps) {
  const [title, setTitle] = useState(
    initialLesson?.title ?? ""
  );

  const [description, setDescription] = useState(
    initialLesson?.description ?? ""
  );

  const [type, setType] = useState<LessonType>(
    initialLesson?.type ?? "reading"
  );

  const [content, setContent] = useState(
    initialLesson?.content ?? ""
  );

  const [passingScore, setPassingScore] =
    useState(
      initialLesson?.passingScore ?? 70
    );

  const [questions, setQuestions] = useState<
    QuizQuestion[]
  >(initialLesson?.questions ?? []);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!title.trim()) return;

    if (
      type === "quiz" &&
      (
        questions.length === 0 ||
        questions.some(
          (question) =>
            !question.question.trim() ||
            question.options.some(
              (option) => !option.trim()
            )
        )
      )
    ) {
      window.alert(
        "Completa todas las preguntas y respuestas."
      );
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      type,
      content: type === "reading" ? content : "",
      questions: type === "quiz" ? questions : [],
      passingScore:
        type === "quiz" ? passingScore : 0,
    });
  }

  return (
    <form
      className="sf-lesson-editor sf-card"
      onSubmit={handleSubmit}
    >
      <h3>
        {initialLesson
          ? "Editar lección"
          : "Nueva lección"}
      </h3>

      <label>
        Título
        <input
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="Nombre de la lección"
          required
        />
      </label>

      <label>
        Descripción
        <textarea
          rows={2}
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
        />
      </label>

      <label>
        Tipo de lección
        <select
          value={type}
          onChange={(event) =>
            setType(
              event.target.value as LessonType
            )
          }
        >
          <option value="reading">
            Lectura
          </option>
          <option value="quiz">
            Evaluación
          </option>
        </select>
      </label>

      {type === "reading" ? (
        <label>
          Contenido
          <textarea
            rows={10}
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            placeholder="Escribe el contenido de la lección..."
            required
          />
        </label>
      ) : (
        <>
          <label>
            Calificación mínima para aprobar
            <input
              type="number"
              min={0}
              max={100}
              value={passingScore}
              onChange={(event) =>
                setPassingScore(
                  Number(event.target.value)
                )
              }
            />
          </label>

          <QuestionEditor
            questions={questions}
            onChange={setQuestions}
          />
        </>
      )}

      <div className="sf-lesson-editor-actions">
        <button
          type="button"
          className="sf-academy-secondary"
          onClick={onCancel}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="sf-academy-primary"
        >
          Guardar lección
        </button>
      </div>
    </form>
  );
}
