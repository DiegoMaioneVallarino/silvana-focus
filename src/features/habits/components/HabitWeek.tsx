
import { Check, Minus } from "lucide-react";

import type { Habit } from "../habits.types";
import { useHabitsStore } from "../habits.store";

import {
  getHabitStartDate,
  getHabitWeekDates,
  isHabitScheduled,
} from "../habits.utils";

import { toLocalDateKey } from "../../streaks/streaks.utils";

interface HabitWeekProps {
  habit: Habit;
}

const weekdayLabels = [
  "L",
  "M",
  "M",
  "J",
  "V",
  "S",
  "D",
];

export function HabitWeek({ habit }: HabitWeekProps) {
  const toggleHabitDate = useHabitsStore(
    (state) => state.toggleHabitDate
  );

  const today = toLocalDateKey(new Date());
  const startDate = getHabitStartDate(habit);
  const dates = getHabitWeekDates();

  return (
    <div className="sf-habit-week">
      {dates.map((date, index) => {
        const scheduled = isHabitScheduled(habit, date);
        const completed = habit.completedDates.includes(date);

        const disabled =
          !scheduled ||
          date < startDate ||
          date > today ||
          !!habit.archivedAt;

        return (
          <div key={date} className="sf-habit-day">
            <span>{weekdayLabels[index]}</span>

            <button
              type="button"
              disabled={disabled}
              className={[
                "sf-habit-day-button",
                completed ? "completed" : "",
                date === today ? "today" : "",
              ].join(" ")}
              style={
                completed
                  ? { backgroundColor: habit.color }
                  : undefined
              }
              onClick={() =>
                toggleHabitDate(habit.id, date)
              }
              title={`${date} - ${
                !scheduled
                  ? "Día de descanso"
                  : completed
                    ? "Completado"
                    : "Pendiente"
              }`}
            >
              {completed ? (
                <Check size={17} />
              ) : !scheduled ? (
                <Minus size={15} />
              ) : (
                <span className="sf-habit-day-dot" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
