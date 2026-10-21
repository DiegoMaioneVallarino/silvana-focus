
import { Link } from "react-router-dom";
import { Flame, ArrowUpRight } from "lucide-react";

import { useHabitsStore } from "../../habits/habits.store";
import { isHabitScheduled } from "../../habits/habits.utils";
import { toLocalDateKey } from "../../streaks/streaks.utils";

export function DashboardHabitsCard() {
  const habits = useHabitsStore((s) => s.habits);
  const today = toLocalDateKey(new Date());

  const scheduled = habits.filter(
    (habit) =>
      !habit.archivedAt &&
      isHabitScheduled(habit, today)
  );

  const completed = scheduled.filter(
    (habit) => habit.completedDates.includes(today)
  );

  const percentage = scheduled.length
    ? Math.round(
        (completed.length / scheduled.length) * 100
      )
    : 0;

  return (
    <section className="sf-card sf-dashboard-widget">
      <div className="sf-dashboard-widget-header">
        <div className="sf-dashboard-widget-title">
          <Flame size={19} color="#ff5a12" />
          <h3>Hábitos de hoy</h3>
        </div>

        <Link to="/habits">
          <ArrowUpRight size={17} />
        </Link>
      </div>

      <strong className="sf-dashboard-widget-value">
        {completed.length}/{scheduled.length}
      </strong>

      <span className="sf-dashboard-widget-label">
        Hábitos completados
      </span>

      <div className="sf-finance-progress">
        <div
          style={{
            width: `${percentage}%`,
            background: "#ff5a12",
          }}
        />
      </div>

      <div className="sf-dashboard-widget-footer">
        <span>
          {percentage}% de cumplimiento
        </span>
      </div>
    </section>
  );
}
