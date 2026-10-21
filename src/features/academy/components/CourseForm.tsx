
import { useState } from "react";
import type { FormEvent } from "react";

import { useAcademyStore } from "../academy.store";
import { useGoalsStore } from "../../goals/goals.store";

interface CourseFormProps {
  onCreated?: (id: string) => void;
}

export function CourseForm({
  onCreated,
}: CourseFormProps) {
  const createCourse = useAcademyStore(
    (state) => state.createCourse
  );

  const goals = useGoalsStore(
    (state) => state.goals
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("📚");
  const [color, setColor] = useState("#873cff");
  const [goalId, setGoalId] = useState("");

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!title.trim()) return;

    const id = createCourse({
      title: title.trim(),
      description: description.trim(),
      emoji: emoji || "📚",
      color,
      goalId: goalId || null,
    });

    onCreated?.(id);

    setTitle("");
    setDescription("");
  }

  return (
    <form
      className="sf-course-form"
      onSubmit={handleSubmit}
    >
      <h3>Crear curso</h3>

      <div className="sf-course-form-row">
        <label>
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
          Nombre del curso
          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Ej. Programación en TypeScript"
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
          rows={3}
        />
      </label>

      <label>
        Color
        <input
          type="color"
          value={color}
          onChange={(event) =>
            setColor(event.target.value)
          }
        />
      </label>

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
            <option
              key={goal.id}
              value={goal.id}
            >
              {goal.title}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="sf-academy-primary"
      >
        Crear curso
      </button>
    </form>
  );
}
