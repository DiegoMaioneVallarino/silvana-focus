
import { BookOpen, CheckCircle2 } from "lucide-react";

import type { Lesson } from "../academy.types";

interface LessonViewerProps {
  lesson: Lesson;
  onComplete: () => void;
  onClose: () => void;
}

export function LessonViewer({
  lesson,
  onComplete,
  onClose,
}: LessonViewerProps) {
  return (
    <div className="sf-lesson-viewer sf-card">
      <div className="sf-lesson-viewer-header">
        <BookOpen size={22} color="#873cff" />

        <button onClick={onClose}>
          Cerrar
        </button>
      </div>

      <h2>{lesson.title}</h2>
      <p className="sf-muted">
        {lesson.description}
      </p>

      <div className="sf-lesson-content">
        {lesson.content
          .split("\n\n")
          .map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
      </div>

      <button
        className="sf-academy-primary"
        onClick={onComplete}
      >
        <CheckCircle2 size={18} />
        Completar lección
      </button>
    </div>
  );
}
