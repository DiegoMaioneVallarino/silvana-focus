
import { Link } from "react-router-dom";

import { useCalendarStore } from "../../calendar/calendar.store";
import { toLocalDateKey } from "../../calendar/calendar.utils";

export function TodaySchedule() {
  const events = useCalendarStore((state) => state.events);

  const today = toLocalDateKey(new Date());

  const todayEvents = events
    .filter((event) => event.date === today)
    .sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );

  return (
    <section className="sf-card sf-schedule">
      <div className="sf-section-header">
        <div>
          <h3>Agenda de hoy</h3>
          <p>Tus actividades programadas.</p>
        </div>

        <Link to="/calendar">Ver calendario →</Link>
      </div>

      <div className="sf-schedule-list">
        {todayEvents.length === 0 ? (
          <p className="sf-muted">
            No tienes actividades programadas para hoy.
          </p>
        ) : (
          todayEvents.map((event) => (
            <div
              key={event.id}
              className="sf-schedule-item"
            >
              <span className="sf-schedule-time">
                {event.startTime}
              </span>

              <div
                className={`sf-schedule-activity ${event.category}`}
              >
                <strong>
                  {event.completed ? "✓ " : ""}
                  {event.title}
                </strong>

                <small>
                  {event.durationMinutes} min
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
