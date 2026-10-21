
import { useState } from "react";
import { Plus, Target } from "lucide-react";

import { useGoalsStore } from "../features/goals/goals.store";

import { Flame } from "lucide-react";

import { useStreakStore } from "../features/streaks/streaks.store";
import { calculateStreak } from "../features/streaks/streaks.utils";

import "./GoalsPage.css";

export function GoalsPage() {
  const goals = useGoalsStore((state) => state.goals);
  const activeGoalId = useGoalsStore(
    (state) => state.activeGoalId
  );

  const createGoal = useGoalsStore(
    (state) => state.createGoal
  );

  const selectGoal = useGoalsStore(
    (state) => state.selectGoal
  );

  const addStage = useGoalsStore(
    (state) => state.addStage
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [months, setMonths] = useState(12);
  const [stageTitle, setStageTitle] = useState("");

  const activeGoal = goals.find(
    (goal) => goal.id === activeGoalId
  );

  function handleCreateGoal(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) return;

    createGoal({
      title: title.trim(),
      description: description.trim(),
      durationMonths: months,
    });

    setTitle("");
    setDescription("");
  }

  function handleAddStage(e: React.FormEvent) {
    e.preventDefault();

    if (!activeGoal || !stageTitle.trim()) return;

    addStage(activeGoal.id, stageTitle.trim(), "");
    setStageTitle("");
  }

const activityRecords = useStreakStore(
  (state) => state.records
);

const streakSettings = useStreakStore(
  (state) => state.settings
);

const goalStreak = activeGoal
  ? calculateStreak(
      activityRecords,
      streakSettings,
      activeGoal.id
    )
  : null;

  return (
    <div className="sf-goals-page">
      <div className="sf-goals-heading">
        <div>
          <h2>Mis objetivos</h2>
          <p className="sf-muted">
            Construye recorridos para alcanzar tus metas.
          </p>
          
{goalStreak && (
  <div className="sf-goal-streak-summary">
    <Flame size={22} color="#ff8500" />

    <div>
      <strong>{goalStreak.current} días de racha</strong>
      <p>
        Récord: {goalStreak.longest} días ·
        Total: {goalStreak.totalActiveDays} días activos
      </p>
    </div>
  </div>
)}

        </div>
      </div>

      <div className="sf-goals-layout">
        <section className="sf-card sf-goals-panel">
          <h3>Tus objetivos</h3>

          <div className="sf-goals-list">
            {goals.map((goal) => (
              <button
                key={goal.id}
                className={`sf-goal-select ${
                  activeGoalId === goal.id ? "active" : ""
                }`}
                onClick={() => selectGoal(goal.id)}
              >
                <Target size={18} />
                <span>{goal.title}</span>
              </button>
            ))}
          </div>

          <form
            className="sf-goal-form"
            onSubmit={handleCreateGoal}
          >
            <h3>Nuevo objetivo</h3>

            <input
              placeholder="¿Qué quieres lograr?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Describe tu objetivo"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

            <label>
              Duración estimada (meses)
              <input
                type="number"
                min={1}
                max={120}
                value={months}
                onChange={(e) =>
                  setMonths(Number(e.target.value))
                }
              />
            </label>

            <button type="submit">
              <Plus size={16} />
              Crear objetivo
            </button>
          </form>
        </section>

        <section className="sf-card sf-goals-panel">
          {activeGoal ? (
            <>
              <h3>{activeGoal.title}</h3>

              <p className="sf-muted">
                {activeGoal.description}
              </p>

              <div className="sf-goals-stages">
                {activeGoal.stages.map((stage, index) => (
                  <div
                    key={stage.id}
                    className="sf-goals-stage-item"
                  >
                    <span>{index + 1}</span>

                    <div>
                      <strong>{stage.title}</strong>
                      <p>{stage.status}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleAddStage}
                className="sf-add-stage-form"
              >
                <input
                  placeholder="Nombre de la nueva etapa"
                  value={stageTitle}
                  onChange={(e) =>
                    setStageTitle(e.target.value)
                  }
                  required
                />

                <button type="submit">
                  <Plus size={16} />
                  Añadir etapa
                </button>
              </form>
            </>
          ) : (
            <p>Selecciona un objetivo para comenzar.</p>
          )}
        </section>
      </div>
    </div>
  );
}
