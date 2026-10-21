
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "./Header.css";

export function Header() {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Buenos días"
      : hour < 19
      ? "Buenas tardes"
      : "Buenas noches";

  return (
    <header className="sf-header">
      <div className="sf-header-greeting">
        <h1>
          {greeting}, <span>Diego</span>
        </h1>

        <p>Esta semana estás avanzando.</p>

        <small>
          Disciplina hoy, la vida que quieres mañana.
        </small>
      </div>

      <div className="sf-header-actions">
        <div className="sf-week-selector">
          <CalendarDays size={18} />
          <span>Esta semana</span>
          <ChevronLeft size={16} />
          <ChevronRight size={16} />
        </div>

        <button
          className="sf-header-icon"
          aria-label="Notificaciones"
        >
          <Bell size={20} />
        </button>

        <div className="sf-avatar">D</div>
      </div>
    </header>
  );
}
