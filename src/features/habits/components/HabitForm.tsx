
import { useState } from "react";
import type { FormEvent } from "react";

import { useHabitsStore } from "../habits.store";
import { useGoalsStore } from "../../goals/goals.store";

import type {
  Habit,
  HabitFrequency,
} from "../habits.types";

interface HabitFormProps {
  habit?: Habit;
  onDone?: () => void;
}

const colors = [
  "#873cff",
  "#ff5a12",
  "#3d73ff",
  "#20b879",
  "#ec4899",
];

const weekdays = [
  { id: 1, label: "L" },
  { id: 2, label: "M" },
  { id: 3, label: "M" },
  { id: 4, label: "J" },
  { id: 5, label: "V" },
  { id: 6, label: "S" },
  { id: 0, label: "D" },
];

export function HabitForm({
  habit,
  onDone,
}: HabitFormProps) {
  const goals = useGoalsStore((state) => state.goals);

  const addHabit = useHabitsStore(
    (state) => state.addHabit
  );
  const updateHabit = useHabitsStore(
    (state) => state.updateHabit
  );

  const [title, setTitle] = useState(
    habit?.title ?? ""
  );
  const [description, setDescription] = useState(
    habit?.description ?? ""
  );
  const [emoji, setEmoji] = useState(
    habit?.emoji ?? "✨"
  );
  const [color, setColor] = useState(
    habit?.color ?? "#873cff"
  );

  const [frequency, setFrequency] =
    useState<HabitFrequency>(
      habit?.frequency ?? "daily"
    );

  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(
    habit?.daysOfWeek ?? [1, 2, 3, 4, 5]
  );

  const [goalId, setGoalId] = useState(
    habit?.goalId ?? ""
  );

  function toggleDay(day: number) {
    setDaysOfWeek((current) =>
      current.includes(day)
        ? current.filter((item) => item !== day)
        : [...current, day]
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) return;

    if (
      frequency === "weekly" &&
      daysOfWeek.length === 0
    ) {
      return;
    }

    const input = {
      title: title.trim(),
      description: description.trim(),
      emoji: emoji.trim() || "✨",
      color,
      frequency,
      daysOfWeek:
        frequency === "daily"
          ? [0, 1, 2, 3, 4, 5, 6]
          : [...daysOfWeek].sort(),
      goalId: goalId || null,
    };

    if (habit) {
      updateHabit(habit.id, input);
    } else {
      addHabit(input);

      setTitle("");
      setDescription("");
    }

    onDone?.();
  }

  return (
    <form
      className="sf-habit-form"
      onSubmit={handleSubmit}
    >
      <h3>
        {habit ? "Editar hábito" : "Nuevo hábito"}
      </h3>

      <div className="sf-habit-form-row">
        <label className="sf-habit-emoji-field">
          Emoji
          <input
            value={emoji}
            onChange={(event) =>
              setEmoji(event.target.value)
            }
            maxLength={8}
          />
        </label>

        <label>
          Nombre
          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Ej. Leer 30 minutos"
            required
          />
        </label>
      </div>

      <label>
        Descripción
        <textarea
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          rows={2}
          placeholder="¿Qué quieres conseguir?"
        />
      </label>

      <label>
        Color
        <div className="sf-habit-colors">
          {colors.map((option) => (
            <button
              key={option}
              type="button"
              className={
                color === option ? "selected" : ""
              }
              style={{ background: option }}
              onClick={() => setColor(option)}
              aria-label={`Color ${option}`}
              aria-pressed={color === option}
            />
          ))}
        </div>
      </label>

      <label>
        Frecuencia
        <select
          value={frequency}
          onChange={(event) =>
            setFrequency(
              event.target.value as HabitFrequency
            )
          }
        >
          <option value="daily">
            Todos los días
          </option>
          <option value="weekly">
            Días específicos
          </option>
        </select>
      </label>

      {frequency === "weekly" && (
        <div className="sf-habit-weekday-picker">
          <span>Días programados</span>

          <div>
            {weekdays.map((day) => (
              <button
                key={day.id}
                type="button"
                className={
                  daysOfWeek.includes(day.id)
                    ? "selected"
                    : ""
                }
                onClick={() => toggleDay(day.id)}
                title={`Día ${day.id}`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <label>
        Objetivo relacionado
        <select
          value={goalId}
          onChange={(event) =>
            setGoalId(event.target.value)
          }
        >
          <option value="">Sin objetivo</option>

          {goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.title}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="sf-habit-submit"
      >
        {habit ? "Guardar cambios" : "Crear hábito"}
      </button>
    </form>
  );
}
