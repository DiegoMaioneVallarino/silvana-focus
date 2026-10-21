
import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

import type { Lesson } from "../academy.types";
import { gradeQuiz } from "../academy.utils";

interface QuizViewerProps {
  lesson: Lesson;
  onSubmit: (score: number) => boolean;
  onClose: () => void;
}

export function QuizViewer({
  lesson,
  onSubmit,
  onClose,
}: QuizViewerProps) {
  const [answers, setAnswers] = useState<
    Record<string, number>
  >({});

  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
  } | null>(null);

  const allAnswered = lesson.questions.every(
    (question) =>
      answers[question.id] !== undefined
  );

  function handleSubmit() {
    if (!allAnswered) return;

    const score = gradeQuiz(
      lesson.questions,
      answers
    );

    const passed = onSubmit(score);

    setResult({ score, passed });
  }

  function handleRetry() {
    setAnswers({});
    setResult(null);
  }

  return (
    <div className="sf-quiz-viewer sf-card">
      <div className="sf-lesson-viewer-header">
        <span>Evaluación</span>

        <button onClick={onClose}>
          Cerrar
        </button>
      </div>

      <h2>{lesson.title}</h2>

      <p className="sf-muted">
        Necesitas {lesson.passingScore}% para aprobar.
      </p>

      {lesson.questions.map((question, index) => (
        <div
          key={question.id}
          className="sf-quiz-question"
        >
          <h4>
            {index + 1}. {question.question}
          </h4>

          <div className="sf-quiz-options">
            {question.options.map((option, optionIndex) => (
              <button
                key={optionIndex}
                type="button"
                disabled={result !== null}
                className={
                  answers[question.id] === optionIndex
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setAnswers((current) => ({
                    ...current,
                    [question.id]: optionIndex,
                  }))
                }
              >
                {option}
              </button>
            ))}
          </div>

          {result && (
            <p className="sf-quiz-explanation">
              {question.explanation}
            </p>
          )}
        </div>
      ))}

      {result ? (
        <div className="sf-quiz-result">
          <CheckCircle2
            size={25}
            color={
              result.passed
                ? "#20b879"
                : "#ff5a12"
            }
          />

          <h3>
            {result.passed
              ? "¡Evaluación aprobada!"
              : "Sigue practicando"}
          </h3>

          <strong>{result.score}%</strong>

          {result.passed ? (
            <button
              className="sf-academy-primary"
              onClick={onClose}
            >
              Continuar
            </button>
          ) : (
            <button
              className="sf-academy-primary"
              onClick={handleRetry}
            >
              <RotateCcw size={17} />
              Reintentar
            </button>
          )}
        </div>
      ) : (
        <button
          className="sf-academy-primary"
          disabled={!allAnswered}
          onClick={handleSubmit}
        >
          Calificar evaluación
        </button>
      )}
    </div>
  );
}
