
import { useState } from "react";
import { CalendarClock, X } from "lucide-react";

import { scheduleSource } from "../planner.sync";
import type { PlannerPriority } from "../planner.types";

import "./TaskScheduleButton.css";

interface TaskScheduleButtonProps {
  taskId: string;
  taskTitle: string;
  priority?: PlannerPriority;
}

function getLocalDate(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function TaskScheduleButton({
  taskId,
  taskTitle,
  priority = "medium",
}: TaskScheduleButtonProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(getLocalDate);
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState(30);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const schedule = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const result = scheduleSource({
      source: "task",
      sourceId: taskId,
      title: taskTitle,
      date,
      startTime: time,
      durationMinutes: duration,
      priority,
    });

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="sf-task-schedule-trigger"
        onClick={() => {
          setError("");
          setSuccess(false);
          setOpen(true);
        }}
      >
        <CalendarClock size={15} />
        Planificar
      </button>

      {success && (
        <span className="sf-task-schedule-success">
          ¡Agendada!
        </span>
      )}

      {open && (
        <div
          className="sf-task-schedule-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <form
            className="sf-task-schedule-modal"
            onSubmit={schedule}
          >
            <div className="sf-task-schedule-header">
              <div>
                <h3>Planificar tarea</h3>
                <p>{taskTitle}</p>
              </div>

              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <label>
              Fecha
              <input
                type="date"
                required
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>

            <label>
              Hora de inicio
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

            {error && (
              <p className="sf-task-schedule-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="sf-task-schedule-submit"
            >
              Agregar al plan diario
            </button>
          </form>
        </div>
      )}
    </>
  );
}
