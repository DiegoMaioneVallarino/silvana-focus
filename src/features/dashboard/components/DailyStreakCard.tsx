
import { Flame, Check } from "lucide-react";

import { useStreakStore } from "../../streaks/streaks.store";
import {
  calculateStreak,
  getWeekDates,
  toLocalDateKey,
  fromLocalDateKey,
} from "../../streaks/streaks.utils";

import { useGoalsStore } from "../../goals/goals.store";
import "./DailyStreakCard.css";
const dayLabels = ["L", "M", "X", "J", "V", "S", "D"];

export function DailyStreakCard() {
  const records = useStreakStore((state) => state.records);
  const settings = useStreakStore((state) => state.settings);
  const logActivity = useStreakStore(
    (state) => state.logActivity
  );

  const activeGoalId = useGoalsStore(
    (state) => state.activeGoalId
  );

  const today = toLocalDateKey(new Date());
  const week = getWeekDates();

  const summary = calculateStreak(records, settings);

  const activeDates = new Set(
    records.map((record) => record.date)
  );

  return (
    <section className="sf-card sf-streak">
      <div className="sf-section-header">
        <div>
          <h3>Racha diaria</h3>
          <p>Mantén el impulso.</p>
        </div>
      </div>

      <div className="sf-streak-content">
        <div className="sf-streak-count">
          <Flame
            size={34}
            fill={summary.current > 0 ? "#ff8a00" : "none"}
            color="#ff8a00"
          />

          <strong>{summary.current} días</strong>
        </div>

        <div className="sf-streak-week">
          {week.map((date, index) => {
            const completed = activeDates.has(date);
            const restDay = settings.restDays.includes(
              fromLocalDateKey(date).getDay()
            );

            return (
              <div className="sf-streak-day" key={date}>
                <span>{dayLabels[index]}</span>

                <div
                  className={[
                    "sf-streak-dot",
                    completed ? "done" : "",
                    restDay && !completed ? "rest" : "",
                    date === today ? "today" : "",
                  ].join(" ")}
                  title={
                    completed
                      ? "Actividad registrada"
                      : restDay
                      ? "Descanso programado"
                      : "Sin actividad"
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="sf-streak-footer">
        <span>
          {summary.activeToday
            ? "¡Ya registraste actividad hoy!"
            : "Registra tu progreso de hoy."}
        </span>

        <button
          type="button"
          disabled={!activeGoalId || summary.activeToday}
          onClick={() => {
            if (activeGoalId) logActivity(activeGoalId);
          }}
        >
          <Check size={15} />
          Registrar día
        </button>
      </div>
    </section>
  );
}
