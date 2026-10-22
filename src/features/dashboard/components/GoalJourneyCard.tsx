
import {
  Check,
  Gem,
  LockKeyhole,
  Trophy,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useGoalsStore } from "../../goals/goals.store";

export function GoalJourneyCard() {
  const goals = useGoalsStore((state) => state.goals);
  const activeGoalId = useGoalsStore(
    (state) => state.activeGoalId
  );
  const completeStage = useGoalsStore(
    (state) => state.completeStage
  );

  const goal = goals.find(
    (item) => item.id === activeGoalId
  );

  if (!goal) {
    return (
      <section className="sf-card sf-journey">
        <h3>Camino de progreso</h3>
        <p>Aún no tienes un objetivo seleccionado.</p>
        <Link to="/goals">Crear objetivo →</Link>
      </section>
    );
  }

  const completed = goal.stages.filter(
    (stage) => stage.status === "completed"
  ).length;

  const currentIndex = goal.stages.findIndex(
    (stage) => stage.status === "available"
  );

  const focusIndex =
    currentIndex >= 0
      ? currentIndex
      : Math.max(0, goal.stages.length - 1);

  const startIndex = Math.max(
    0,
    Math.min(
      focusIndex - 1,
      goal.stages.length - 3
    )
  );

  const visibleStages = goal.stages.slice(
    startIndex,
    startIndex + 3
  );

  return (
    <section className="sf-card sf-journey">
      <div className="sf-section-header">
        <div>
          <h3>Camino de progreso</h3>
          <p>{goal.title}</p>
        </div>

        <span className="sf-stage-label">
          {currentIndex >= 0
            ? `Etapa ${currentIndex + 1} de ${goal.stages.length}`
            : `${completed} de ${goal.stages.length} completadas`}
        </span>
      </div>

      <div className="sf-journey-list">
        {visibleStages.map((stage, index) => {
          const status =
            stage.status === "available"
              ? "current"
              : stage.status;

          const actualIndex = startIndex + index;

          return (
            <div
              className={`sf-journey-stage ${status}`}
              key={stage.id}
            >
              <div className="sf-journey-track">
                <div className="sf-journey-diamond">
                  {status === "completed" && (
                    <Check size={22} />
                  )}

                  {status === "current" && (
                    <Gem size={22} />
                  )}

                  {status === "locked" && (
                    <LockKeyhole size={18} />
                  )}
                </div>

                {index < visibleStages.length - 1 && (
                  <div className="sf-journey-line" />
                )}
              </div>

              <div className="sf-journey-info">
                <strong>
                  {actualIndex + 1}. {stage.title}
                </strong>

                <p>{stage.description}</p>

                {stage.status === "available" && (
                  <button
                    className="sf-stage-complete"
                    onClick={() =>
                      completeStage(goal.id, stage.id)
                    }
                  >
                    Completar etapa
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sf-journey-reward">
        <Trophy size={20} />
        <span>
          {goal.stages.length > 0 &&
          completed === goal.stages.length
            ? "¡Recorrido completado!"
            : `${completed} de ${goal.stages.length} etapas completadas`}
        </span>
      </div>

      <Link
        to="/goals"
        className="sf-journey-view-all"
      >
        Ver recorrido completo
        <ArrowRight size={15} />
      </Link>
    </section>
  );
}
