
import { Link } from "react-router-dom";
import { todayActivities } from "../data/dashboard.data";

export function TodaySchedule() {
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
        {todayActivities.map((activity) => (
          <div
            key={activity.id}
            className="sf-schedule-item"
          >
            <span className="sf-schedule-time">
              {activity.time}
            </span>

            <div
              className={`sf-schedule-activity ${activity.category}`}
            >
              <strong>{activity.title}</strong>
              <small>{activity.duration}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
