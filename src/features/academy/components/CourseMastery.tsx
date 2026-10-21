
import { useAcademyStore } from "../academy.store";
import { calculateUnitMastery } from "../academy.mastery";

import type { Course } from "../academy.types";

interface CourseMasteryProps {
  course: Course;
}

const statusLabels = {
  not_started: "Sin comenzar",
  learning: "Aprendiendo",
  practicing: "Practicando",
  mastered: "Dominado",
};

export function CourseMastery({
  course,
}: CourseMasteryProps) {
  const progress = useAcademyStore(
    (state) => state.progress[course.id]
  );

  const attempts = useAcademyStore(
    (state) => state.attempts ?? []
  );

  return (
    <section className="sf-card sf-course-mastery">
      <h3>Dominio por unidad</h3>

      <div className="sf-mastery-list">
        {course.units.map((unit) => {
          const mastery = calculateUnitMastery(
            unit,
            progress,
            attempts.filter(
              (attempt) =>
                attempt.courseId === course.id
            )
          );

          const percentage =
            mastery.totalLessons === 0
              ? 0
              : Math.round(
                  (mastery.completedLessons /
                    mastery.totalLessons) *
                    100
                );

          return (
            <div
              className="sf-mastery-unit"
              key={unit.id}
            >
              <div className="sf-mastery-header">
                <strong>{unit.title}</strong>

                <span
                  className={`sf-mastery-status ${mastery.status}`}
                >
                  {statusLabels[mastery.status]}
                </span>
              </div>

              <div className="sf-course-progress">
                <div
                  style={{
                    width: `${percentage}%`,
                    background:
                      mastery.status === "mastered"
                        ? "#20b879"
                        : "#873cff",
                  }}
                />
              </div>

              <small>
                {mastery.completedLessons} /{" "}
                {mastery.totalLessons} lecciones
                {" · "}
                Mejor promedio:{" "}
                {mastery.averageQuizScore === null
                  ? "Sin evaluar"
                  : `${mastery.averageQuizScore}%`}
              </small>
            </div>
          );
        })}
      </div>
    </section>
  );
}
