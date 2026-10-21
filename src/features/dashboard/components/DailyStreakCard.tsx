
import { Flame } from "lucide-react";

const days = [
  { label: "L", done: true },
  { label: "M", done: true },
  { label: "X", done: true },
  { label: "J", done: true },
  { label: "V", done: true },
  { label: "S", done: false },
  { label: "D", done: false },
];

export function DailyStreakCard() {
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
          <Flame size={34} fill="#ff8a00" />
          <strong>12 días</strong>
        </div>

        <div className="sf-streak-week">
          {days.map((day, index) => (
            <div key={index} className="sf-streak-day">
              <span>{day.label}</span>

              <div
                className={
                  day.done
                    ? "sf-streak-dot done"
                    : "sf-streak-dot"
                }
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
