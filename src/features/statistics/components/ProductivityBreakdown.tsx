
import type { CategoryTimeData } from "../statistics.types";

import {
  formatStatisticsDuration,
} from "../statistics.utils";

interface ProductivityBreakdownProps {
  data: CategoryTimeData[];
}

const categoryLabels: Record<string, string> = {
  learning: "Aprendizaje",
  project: "Proyectos",
  exercise: "Ejercicio",
  routine: "Rutinas",
  other: "Otros",
};

const categoryColors: Record<string, string> = {
  learning: "#873cff",
  project: "#3d73ff",
  exercise: "#20b879",
  routine: "#ff5a12",
  other: "#94a3b8",
};

export function ProductivityBreakdown({
  data,
}: ProductivityBreakdownProps) {
  return (
    <section className="sf-card sf-productivity-breakdown">
      <div className="sf-statistics-card-header">
        <h3>Distribución del tiempo</h3>
        <span>Por actividad</span>
      </div>

      {data.length === 0 ? (
        <p className="sf-muted">
          Todavía no hay sesiones registradas.
        </p>
      ) : (
        <div className="sf-breakdown-list">
          {data.map((item) => (
            <div
              key={item.category}
              className="sf-breakdown-item"
            >
              <div className="sf-breakdown-label">
                <span>
                  {categoryLabels[item.category] ??
                    item.category}
                </span>

                <strong>
                  {formatStatisticsDuration(
                    item.seconds
                  )}
                </strong>
              </div>

              <div className="sf-breakdown-track">
                <div
                  style={{
                    width: `${item.percentage}%`,
                    background:
                      categoryColors[item.category] ??
                      "#94a3b8",
                  }}
                />
              </div>

              <small>{item.percentage}%</small>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
