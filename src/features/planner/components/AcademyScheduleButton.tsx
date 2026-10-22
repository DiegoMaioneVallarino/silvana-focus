
import { useState } from "react";
import { CalendarClock, X } from "lucide-react";

import type {
  Course,
  Lesson,
} from "../../academy/academy.types";

import {
  scheduleAcademyLesson,
} from "../planner.academy";

import { toLocalDateKey } from "../../calendar/calendar.utils";
import "./AcademyScheduleButton.css";
import type { FormEvent } from "react";
interface AcademyScheduleButtonProps {
  course: Course;
  lesson: Lesson;
}

export function AcademyScheduleButton({
  course,
  lesson,
}: AcademyScheduleButtonProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(
    toLocalDateKey(new Date())
  );
  const [startTime, setStartTime] = useState("16:00");
  const [durationMinutes, setDurationMinutes] = useState(45);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit(
event: FormEvent<HTMLFormElement>  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const result = scheduleAcademyLesson({
      course,
      lesson,
      date,
      startTime,
      durationMinutes,
    });

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess("Sesión añadida al Planner.");
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="sf-academy-schedule-trigger"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      >
        <CalendarClock size={15} />
        Planificar
      </button>

      {success && (
        <span className="sf-academy-schedule-success">
          {success}
        </span>
      )}

      {open && (
        <div
          className="sf-academy-schedule-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <form
            className="sf-academy-schedule-modal"
            onSubmit={handleSubmit}
          >
            <div className="sf-academy-schedule-header">
              <div>
                <h3>Planificar estudio</h3>
                <p>{course.title}</p>
                <strong>{lesson.title}</strong>
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
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                required
              />
            </label>

            <label>
              Hora de inicio
              <input
                type="time"
                value={startTime}
                onChange={(event) =>
                  setStartTime(event.target.value)
                }
                required
              />
            </label>

            <label>
              Duración (minutos)
              <input
                type="number"
                min={5}
                max={1440}
                value={durationMinutes}
                onChange={(event) =>
                  setDurationMinutes(Number(event.target.value))
                }
                required
              />
            </label>

            {error && (
              <p className="sf-academy-schedule-error">
                {error}
              </p>
            )}

            <p className="sf-academy-schedule-hint">
              La sesión se añadirá a tu agenda. Completarla
              no aprobará automáticamente la lección.
            </p>

            <button
              type="submit"
              className="sf-academy-schedule-submit"
            >
              Programar sesión
            </button>
          </form>
        </div>
      )}
    </>
  );
}
