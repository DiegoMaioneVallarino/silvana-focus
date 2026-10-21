
import { useState } from "react";
import { Plus } from "lucide-react";

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

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!title.trim()) return;

    addEvent({
      title: title.trim(),
      description: description.trim(),
      date,
      startTime,
      durationMinutes,
      category,
      goalId: goalId || null,
    });

    setTitle("");
    setDescription("");
  }

  return (
    <form className="sf-event-form" onSubmit={handleSubmit}>
      <h3>Nueva actividad</h3>

      <label>
        Nombre
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
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

      <button type="submit" className="sf-event-submit">
        <Plus size={17} />
        Crear actividad
      </button>
    </form>
  );
}
