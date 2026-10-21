
import { Plus, Trash2 } from "lucide-react";

import type {
  QuizQuestion,
} from "../academy.types";

interface QuestionEditorProps {
  questions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}

export function QuestionEditor({
  questions,
  onChange,
}: QuestionEditorProps) {
  function addQuestion() {
    onChange([
      ...questions,
      {
        id: crypto.randomUUID(),
        question: "",
        options: ["", "", "", ""],
        correctOption: 0,
        explanation: "",
      },
    ]);
  }

  function updateQuestion(
    id: string,
    changes: Partial<QuizQuestion>
  ) {
    onChange(
      questions.map((question) =>
        question.id === id
          ? { ...question, ...changes }
          : question
      )
    );
  }

  function updateOption(
    questionId: string,
    index: number,
    value: string
  ) {
    onChange(
      questions.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        const options = [...question.options];
        options[index] = value;

        return { ...question, options };
      })
    );
  }

  function deleteQuestion(id: string) {
    onChange(
      questions.filter(
        (question) => question.id !== id
      )
    );
  }

  return (
    <div className="sf-question-editor">
      <div className="sf-editor-section-header">
        <h4>Preguntas</h4>

        <button
          type="button"
          className="sf-academy-secondary"
          onClick={addQuestion}
        >
          <Plus size={16} />
          Agregar pregunta
        </button>
      </div>

      {questions.map((question, index) => (
        <div
          className="sf-question-editor-card"
          key={question.id}
        >
          <div className="sf-editor-section-header">
            <strong>Pregunta {index + 1}</strong>

            <button
              type="button"
              className="sf-editor-icon-danger"
              onClick={() =>
                deleteQuestion(question.id)
              }
              title="Eliminar pregunta"
            >
              <Trash2 size={17} />
            </button>
          </div>

          <label>
            Enunciado
            <textarea
              rows={2}
              value={question.question}
              onChange={(event) =>
                updateQuestion(question.id, {
                  question: event.target.value,
                })
              }
              placeholder="Escribe la pregunta..."
              required
            />
          </label>

          <div className="sf-question-options-editor">
            {question.options.map((option, optionIndex) => (
              <div
                className="sf-question-option-editor"
                key={optionIndex}
              >
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={
                    question.correctOption === optionIndex
                  }
                  onChange={() =>
                    updateQuestion(question.id, {
                      correctOption: optionIndex,
                    })
                  }
                  title="Respuesta correcta"
                />

                <input
                  value={option}
                  onChange={(event) =>
                    updateOption(
                      question.id,
                      optionIndex,
                      event.target.value
                    )
                  }
                  placeholder={`Opción ${optionIndex + 1}`}
                  required
                />
              </div>
            ))}
          </div>

          <label>
            Explicación
            <textarea
              rows={2}
              value={question.explanation}
              onChange={(event) =>
                updateQuestion(question.id, {
                  explanation: event.target.value,
                })
              }
              placeholder="Explica por qué esta respuesta es correcta..."
            />
          </label>
        </div>
      ))}

      {questions.length === 0 && (
        <p className="sf-muted">
          Agrega al menos una pregunta para crear
          la evaluación.
        </p>
      )}
    </div>
  );
}
