
import { useState } from "react";
import {
  Plus,
  X,
  Heart,
  Flame,
  CheckCircle2,
} from "lucide-react";

import { useHabitsStore } from "../features/habits/habits.store";
import { getHabitStats } from "../features/habits/habits.utils";

import { HabitCard } from "../features/habits/components/HabitCard";
import { HabitForm } from "../features/habits/components/HabitForm";

import "./HabitsPage.css";

export function HabitsPage() {
  const habits = useHabitsStore(
    (state) => state.habits
  );

  const [showForm, setShowForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const activeHabits = habits.filter(
    (habit) => !habit.archivedAt
  );

  const archivedHabits = habits.filter(
    (habit) => !!habit.archivedAt
  );

  const completedToday = activeHabits.filter(
    (habit) => getHabitStats(habit).completedToday
  ).length;

  const scheduledToday = activeHabits.filter(
    (habit) => getHabitStats(habit).scheduledToday
  ).length;

  const bestStreak = activeHabits.reduce(
    (maximum, habit) =>
      Math.max(
        maximum,
        getHabitStats(habit).currentStreak
      ),
    0
  );

  const visibleHabits = showArchived
    ? archivedHabits
    : activeHabits;

  return (
    <div className="sf-habits-page">
      <header className="sf-habits-header">
        <div>
          <h2>Mis hábitos</h2>
          <p className="sf-muted">
            Pequeñas acciones, grandes resultados.
          </p>
        </div>

        <button
          className="sf-habit-primary-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <X size={17} />
          ) : (
            <Plus size={17} />
          )}

          {showForm ? "Cerrar" : "Nuevo hábito"}
        </button>
      </header>

      <div className="sf-habits-summary">
        <div className="sf-card">
          <Heart size={20} color="#873cff" />
          <strong>{activeHabits.length}</strong>
          <span>Hábitos activos</span>
        </div>

        <div className="sf-card">
          <CheckCircle2 size={20} color="#20b879" />
          <strong>
            {completedToday}/{scheduledToday}
          </strong>
          <span>Completados hoy</span>
        </div>

        <div className="sf-card">
          <Flame size={20} color="#ff5a12" />
          <strong>{bestStreak}</strong>
          <span>Mayor racha actual</span>
        </div>
      </div>

      {showForm && (
        <section className="sf-card sf-habit-form-panel">
          <HabitForm
            onDone={() => setShowForm(false)}
          />
        </section>
      )}

      <div className="sf-habits-toolbar">
        <button
          className={!showArchived ? "active" : ""}
          onClick={() => setShowArchived(false)}
        >
          Activos ({activeHabits.length})
        </button>

        <button
          className={showArchived ? "active" : ""}
          onClick={() => setShowArchived(true)}
        >
          Archivados ({archivedHabits.length})
        </button>
      </div>

      {visibleHabits.length === 0 ? (
        <section className="sf-card sf-habits-empty">
          <h3>
            {showArchived
              ? "No tienes hábitos archivados."
              : "Comienza con un pequeño hábito."}
          </h3>

          <p>
            {showArchived
              ? "Los hábitos archivados aparecerán aquí."
              : "Crea tu primer hábito y empieza a registrar tu constancia."}
          </p>
        </section>
      ) : (
        <div className="sf-habits-grid">
          {visibleHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
