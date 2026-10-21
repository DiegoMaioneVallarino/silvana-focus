
import { useState } from "react";
import {
  Archive,
  RotateCcw,
  Trash2,
  Pencil,
  Flame,
} from "lucide-react";

import type { Habit } from "../habits.types";

import { useHabitsStore } from "../habits.store";
import { getHabitStats } from "../habits.utils";

import { HabitWeek } from "./HabitWeek";
import { HabitForm } from "./HabitForm";

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const [editing, setEditing] = useState(false);

  const archiveHabit = useHabitsStore(
    (state) => state.archiveHabit
  );
  const restoreHabit = useHabitsStore(
    (state) => state.restoreHabit
  );
  const deleteHabit = useHabitsStore(
    (state) => state.deleteHabit
  );

  const stats = getHabitStats(habit);

  function handleDelete() {
    if (
      window.confirm(
        `¿Eliminar "${habit.title}" y todo su historial?`
      )
    ) {
      deleteHabit(habit.id);
    }
  }

  return (
    <article className="sf-habit-card sf-card">
      <div className="sf-habit-card-header">
        <div
          className="sf-habit-emoji"
          style={{
            backgroundColor: `${habit.color}16`,
          }}
        >
          {habit.emoji}
        </div>

        <div className="sf-habit-card-title">
          <h3>{habit.title}</h3>

          {habit.description && (
            <p>{habit.description}</p>
          )}
        </div>

        <div className="sf-habit-card-actions">
          {!habit.archivedAt && (
            <button
              type="button"
              title="Editar hábito"
              onClick={() => setEditing(!editing)}
            >
              <Pencil size={16} />
            </button>
          )}

          <button
            type="button"
            title={
              habit.archivedAt
                ? "Restaurar hábito"
                : "Archivar hábito"
            }
            onClick={() =>
              habit.archivedAt
                ? restoreHabit(habit.id)
                : archiveHabit(habit.id)
            }
          >
            {habit.archivedAt ? (
              <RotateCcw size={16} />
            ) : (
              <Archive size={16} />
            )}
          </button>

          <button
            type="button"
            title="Eliminar hábito"
            onClick={handleDelete}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {editing && !habit.archivedAt && (
        <div className="sf-habit-edit-panel">
          <HabitForm
            habit={habit}
            onDone={() => setEditing(false)}
          />
        </div>
      )}

      <div className="sf-habit-metrics">
        <div>
          <span className="sf-habit-metric-icon">
            <Flame size={17} color="#ff5a12" />
          </span>

          <strong>{stats.currentStreak}</strong>
          <small>Racha actual</small>
        </div>

        <div>
          <strong>{stats.longestStreak}</strong>
          <small>Mejor racha</small>
        </div>

        <div>
          <strong>{stats.completionRate}%</strong>
          <small>Cumplimiento</small>
        </div>
      </div>

      <HabitWeek habit={habit} />

      <div className="sf-habit-card-footer">
        <span>
          {habit.archivedAt
            ? "Hábito archivado"
            : stats.scheduledToday
              ? stats.completedToday
                ? "✓ Completado hoy"
                : "Pendiente de hoy"
              : "Día de descanso"}
        </span>

        <small>
          {stats.completedDays} cumplimientos
        </small>
      </div>
    </article>
  );
}
