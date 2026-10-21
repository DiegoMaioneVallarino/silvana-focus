
import { CalendarDays } from "lucide-react";

export function CalendarPage() {
  return (
    <section>
      <h2>Mi agenda</h2>
      <p className="sf-muted">
        Organiza tu tiempo y controla tus actividades.
      </p>

      <div className="sf-card module-placeholder">
        <CalendarDays size={32} color="#3d73ff" />

        <h3>Planifica tu día</h3>

        <p>
          Visualiza tus horarios, actividades,
          compromisos y bloques de concentración.
        </p>
      </div>
    </section>
  );
}
