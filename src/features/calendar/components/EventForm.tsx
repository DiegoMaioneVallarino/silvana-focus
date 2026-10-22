import { useState } from "react";
import { Plus, AlertCircle, CheckCircle2 } from "lucide-react";

import { useCalendarStore } from "../calendar.store";
import type { CalendarEventCategory } from "../calendar.types";
import { toLocalDateKey } from "../calendar.utils";
import { useGoalsStore } from "../../goals/goals.store";

interface EventFormProps {
  selectedDate?: string;
}

export function EventForm({ selectedDate }: EventFormProps) {
  const addEvent = useCalendarStore((state) => state.addEvent);
  const goals = useGoalsStore((state) => state.goals);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(
    selectedDate ?? toLocalDateKey(new Date())
  );
  const [startTime, setStartTime] = useState("09:00");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [category, setCategory] =
    useState<CalendarEventCategory>("learning");
  const [goalId, setGoalId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Escribe el nombre de la actividad.");
      return;
    }

    if (
      !Number.isInteger(durationMinutes) ||
      durationMinutes < 5 ||
      durationMinutes > 1440
    ) {
      setError("La duración debe estar entre 5 y 1440 minutos.");
      return;
    }

    const [hours, minutes] = startTime.split(":").map(Number);

    if (
      !Number.isInteger(hours) ||
      !Number.isInteger(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59 ||
      hours * 60 + minutes + durationMinutes > 1440
    ) {
      setError(
        "La actividad debe terminar antes de las 00:00."
      );
      return;
    }

    const result = addEvent({
      title: title.trim(),
      description: description.trim(),
      date,
      startTime,
      durationMinutes,
      category,
      goalId: goalId || null,
    });

    if (!result.success) {
      setError(result.error);
      return;
    }

    setTitle("");
    setDescription("");

    setSuccess("Actividad creada y sincronizada con tu Planner.");
  }

  return (
    <form className="sf-event-form" onSubmit={handleSubmit}>
      <h3>Nueva actividad</h3>

      <label>
        Nombre
        <input
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setError("");
            setSuccess("");
          }}
          placeholder="Ej. Estudiar matemáticas"
          required
        />
      </label>

      <label>
        Descripción
        <textarea
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder="Detalles opcionales"
          rows={2}
        />
      </label>

      <label>
        Fecha
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
        />
      </label>

      <div className="sf-event-form-row">
        <label>
          Hora
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
          Duración (min)
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
      </div>

      <label>
        Categoría
        <select
          value={category}
          onChange={(event) =>
            setCategory(
              event.target.value as CalendarEventCategory
            )
          }
        >
          <option value="learning">Aprendizaje</option>
          <option value="project">Proyecto</option>
          <option value="exercise">Ejercicio</option>
          <option value="routine">Rutina</option>
          <option value="finance">Finanzas</option>
          <option value="other">Otro</option>
        </select>
      </label>

      <label>
        Objetivo asociado
        <select
          value={goalId}
          onChange={(event) => setGoalId(event.target.value)}
        >
          <option value="">Sin objetivo</option>
          {goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.title}
            </option>
          ))}
        </select>
      </label>

      {error && (
        <div className="sf-event-feedback error" role="alert">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="sf-event-feedback success" role="status">
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}

      <button type="submit" className="sf-event-submit">
        <Plus size={17} />
        Crear actividad
      </button>
    </form>
  );
}