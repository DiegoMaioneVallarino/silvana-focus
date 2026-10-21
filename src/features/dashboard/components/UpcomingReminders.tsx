
import { Bell } from "lucide-react";
import { upcomingReminders } from "../data/dashboard.data";

export function UpcomingReminders() {
  return (
    <section className="sf-card sf-reminders">
      <div className="sf-section-header">
        <div>
          <h3>Recordatorios</h3>
          <p>No olvides lo importante.</p>
        </div>
      </div>

      {upcomingReminders.map((reminder) => (
        <div className="sf-reminder-item" key={reminder.id}>
          <Bell size={18} />

          <span>{reminder.title}</span>

          <small>{reminder.date}</small>
        </div>
      ))}
    </section>
  );
}
