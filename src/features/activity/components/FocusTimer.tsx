
import { useEffect, useState } from "react";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Timer,
} from "lucide-react";

import { useStreakStore } from "../../streaks/streaks.store";


import { useGoalsStore } from "../../goals/goals.store";
import { useActivityStore, getElapsedSeconds } from "../activity.store";
import { formatTimer } from "../activity.utils";
import type { ActivityCategory } from "../activity.types";

import "./FocusTimer.css";

export function FocusTimer() {
  const goals = useGoalsStore((state) => state.goals);
  const activeGoalId = useGoalsStore((state) => state.activeGoalId);

  const timer = useActivityStore((state) => state.activeTimer);
  const startTimer = useActivityStore((state) => state.startTimer);
  const pauseTimer = useActivityStore((state) => state.pauseTimer);
  const resumeTimer = useActivityStore((state) => state.resumeTimer);
  const finishTimer = useActivityStore((state) => state.finishTimer);
  const discardTimer = useActivityStore((state) => state.discardTimer);

  const [title, setTitle] = useState("");
  const [goalId, setGoalId] = useState(activeGoalId ?? "");
  const [category, setCategory] =
    useState<ActivityCategory>("learning");
  const [now, setNow] = useState(Date.now());
const logActivity = useStreakStore(
  (state) => state.logActivity
);
  useEffect(() => {
    if (!timer?.resumedAt) return;

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timer?.resumedAt]);

  const elapsed = getElapsedSeconds(timer, now);

  function handleStart() {
    if (!title.trim()) return;

    startTimer(
      title.trim(),
      goalId || null,
      category
    );
  }


function handleFinish() {
  const session = finishTimer();

  if (!session) return;

  // Cinco minutos mínimos para contar
  // como actividad significativa.
  if (
    session.goalId &&
    session.durationSeconds >= 300
  ) {
    logActivity(session.goalId);
  }
}


  return (
    <section className="sf-card sf-focus-timer">
      <div className="sf-focus-heading">
        <Timer size={22} color="#ff5a12" />

        <div>
          <h3>Sesión de enfoque</h3>
          <p>Dedica tiempo a lo que importa.</p>
        </div>
      </div>

      <div className="sf-focus-clock">
        <strong>{formatTimer(elapsed)}</strong>

        <span>
          {!timer
            ? "Listo para comenzar"
            : timer.resumedAt
            ? "En progreso"
            : "En pausa"}
        </span>
      </div>

      {!timer ? (
        <div className="sf-focus-form">
          <input
            placeholder="¿En qué vas a trabajar?"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />

          <select
            value={goalId}
            onChange={(event) =>
              setGoalId(event.target.value)
            }
          >
            <option value="">Sin objetivo asociado</option>

            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>

          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value as ActivityCategory
              )
            }
          >
            <option value="learning">Aprendizaje</option>
            <option value="project">Proyecto</option>
            <option value="exercise">Ejercicio</option>
            <option value="routine">Rutina</option>
            <option value="other">Otro</option>
          </select>

          <button onClick={handleStart} disabled={!title.trim()}>
            <Play size={17} />
            Iniciar enfoque
          </button>
        </div>
      ) : (
        <div className="sf-focus-controls">
          <strong>{timer.title}</strong>

          <div className="sf-focus-buttons">
            {timer.resumedAt ? (
              <button onClick={pauseTimer}>
                <Pause size={17} />
                Pausar
              </button>
            ) : (
              <button onClick={resumeTimer}>
                <Play size={17} />
                Continuar
              </button>
            )}

            <button onClick={handleFinish}>
              <Square size={17} />
              Finalizar
            </button>

            <button
              className="secondary"
              onClick={discardTimer}
              title="Descartar sesión"
            >
              <RotateCcw size={17} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
