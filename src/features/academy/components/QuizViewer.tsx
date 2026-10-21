
import { useState } from "react";

import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
} from "lucide-react";

import type { Lesson } from "../academy.types";

interface QuizResult {
  score: number;
  passed: boolean;
}

interface QuizViewerProps {
  lesson: Lesson;
  onSubmit: (
    answers: Record<string, number>
  ) => QuizResult | null;
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

  const [result, setResult] =
    useState<QuizResult | null>(null);

  const [onlyIncorrect, setOnlyIncorrect] =
    useState(false);

  const incorrectQuestions = lesson.questions.filter(
    (question) =>
      answers[question.id] !== question.correctOption
  );

  const visibleQuestions =
    onlyIncorrect && result
      ? incorrectQuestions
      : lesson.questions;

  const allAnswered = lesson.questions.every(
    (question) =>
      answers[question.id] !== undefined
  );

  function handleSubmit() {
    if (!allAnswered) return;

    const nextResult = onSubmit(answers);

    if (nextResult) {
      setResult(nextResult);
    }
  }

  function handleRetry() {
    setAnswers({});
    setResult(null);
    setOnlyIncorrect(false);
  }

  return (
    <div className="sf-quiz-viewer sf-card">
      <div className="sf-lesson-viewer-header">
        <span>Evaluación interactiva</span>

        <button onClick={onClose}>
          Cerrar
        </button>
      </div>

      <h2>{lesson.title}</h2>

      <p className="sf-muted">
        Calificación mínima: {lesson.passingScore}%
      </p>

      {result && (
        <div
          className={`sf-quiz-feedback ${
            result.passed ? "passed" : "failed"
          }`}
        >
          {result.passed ? (
            <CheckCircle2 size={26} />
          ) : (
            <XCircle size={26} />
          )}

          <div>
            <strong>
              {result.passed
                ? "¡Evaluación aprobada!"
                : "Todavía puedes mejorar"}
            </strong>

            <p>
              Obtuviste {result.score}%.
            </p>
          </div>
        </div>
      )}

      {visibleQuestions.map((question, index) => {
        const selected = answers[question.id];

        const correct =
          selected === question.correctOption;

        return (
          <div
            key={question.id}
            className="sf-quiz-question"
          >
            <h4>
              {index + 1}. {question.question}
            </h4>

            <div className="sf-quiz-options">
              {question.options.map(
                (option, optionIndex) => {
                  const isSelected =
                    selected === optionIndex;

                  const isCorrect =
                    optionIndex ===
                    question.correctOption;

                  let className =
                    isSelected ? "selected" : "";

                  if (result && isCorrect) {
                    className += " correct";
                  }

                  if (
                    result &&
                    isSelected &&
                    !isCorrect
                  ) {
                    className += " incorrect";
                  }

                  return (
                    <button
                      key={optionIndex}
                      type="button"
                      disabled={result !== null}
                      className={className}
                      onClick={() =>
                        setAnswers((current) => ({
                          ...current,
                          [question.id]: optionIndex,
                        }))
                      }
                    >
                      {option}
                    </button>
                  );
                }
              )}
            </div>

            {result && (
              <div
                className={`sf-question-feedback ${
                  correct ? "correct" : "incorrect"
                }`}
              >
                {correct ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <XCircle size={17} />
                )}

                <span>
                  {question.explanation ||
                    (correct
                      ? "Respuesta correcta."
                      : "Revisa la respuesta correcta.")}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {result ? (
        <div className="sf-quiz-result-actions">
          {!result.passed &&
            incorrectQuestions.length > 0 && (
              <button
                className="sf-academy-secondary"
                onClick={() =>
                  setOnlyIncorrect(!onlyIncorrect)
                }
              >
                {onlyIncorrect
                  ? "Ver todas las preguntas"
                  : "Revisar errores"}
              </button>
            )}

          <button
            className="sf-academy-secondary"
            onClick={handleRetry}
          >
            <RotateCcw size={16} />
            Reintentar
          </button>

          <button
            className="sf-academy-primary"
            onClick={onClose}
          >
            <ArrowRight size={16} />
            Continuar
          </button>
        </div>
      ) : (
        <button
          className="sf-academy-primary"
          disabled={!allAnswered}
          onClick={handleSubmit}
        >
          Entregar evaluación
        </button>
      )}
    </div>
  );
}
