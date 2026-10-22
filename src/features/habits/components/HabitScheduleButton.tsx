import { useState } from "react";
import { CalendarClock, X } from "lucide-react";

import type { Habit } from "../../habits/habits.types";

import {
  generateHabitSchedule,
  isHabitScheduledOnDate,
} from "../../planner/planner.recurrence";

import { toLocalDateKey } from "../../streaks/streaks.utils";

import "./HabitScheduleButton.css";

interface HabitScheduleButtonProps {
  habit: Habit;
}

type ScheduleMode = "once" | "week";

export function HabitScheduleButton({
  habit,
}: HabitScheduleButtonProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ScheduleMode>("once");
  const [date, setDate] = useState(
    toLocalDateKey(new Date())
  );
  const [time, setTime] = useState("07:30");
  const [duration, setDuration] = useState(20);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSchedule(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    const result = generateHabitSchedule({
      habit,
      startDate: date,
      startTime: time,
      durationMinutes: duration,
      daysToGenerate: mode === "once" ? 1 : 7,
    });

    if (result.created === 0) {
      setError(
        result.errors[0] ??
          "No se crearon sesiones. Revisa los días del hábito."
      );
      return;
    }

    setMessage(
      `${result.created} ${
        result.created === 1 ? "sesión programada" : "sesiones programadas"
      }`
    );

    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="sf-habit-schedule-trigger"
        onClick={() => {
          setError("");
          setMessage("");
          setOpen(true);
        }}
      >
        <CalendarClock size={15} />
        Planificar
      </button>

      {message && (
        <span className="sf-habit-schedule-success">
          {message}
        </span>
      )}

      {open && (
        <div
          className="sf-habit-schedule-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <form
            className="sf-habit-schedule-modal"
            onSubmit={handleSchedule}
          >
            <div className="sf-habit-schedule-header">
              <div>
                <h3>Planificar hábito</h3>
                <p>
                  {habit.emoji} {habit.title}
                </p>
              </div>

              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="sf-habit-schedule-modes">
              <button
                type="button"
                className={mode === "once" ? "active" : ""}
                onClick={() => setMode("once")}
              >
                Una vez
              </button>

              <button
                type="button"
                className={mode === "week" ? "active" : ""}
                onClick={() => setMode("week")}
              >
                Próximos 7 días
              </button>
            </div>

            <label>
              Fecha inicial
              <input
                type="date"
                required
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>

            <label>
              Hora
              <input
                type="time"
                required
                value={time}
                onChange={(event) => setTime(event.target.value)}
              />
            </label>

            <label>
              Duración (minutos)
              <input
                type="number"
                min={1}
                max={1440}
                required
                value={duration}
                onChange={(event) =>
                  setDuration(Number(event.target.value))
                }
              />
            </label>

            <p className="sf-habit-schedule-hint">
              {mode === "once"
                ? isHabitScheduledOnDate(habit, date)
                  ? "Este día corresponde a la frecuencia del hábito."
                  : "Este día es de descanso para este hábito."
                : "Se crearán sesiones únicamente en los días configurados para este hábito."}
            </p>

            {error && (
              <p className="sf-habit-schedule-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="sf-habit-schedule-submit"
            >
              Programar sesiones
            </button>
          </form>
        </div>
      )}
    </>
  );
}