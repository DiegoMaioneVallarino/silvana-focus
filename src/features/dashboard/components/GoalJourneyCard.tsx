
import {
  Check,
  Gem,
  LockKeyhole,
  Trophy,
} from "lucide-react";

import { goalStages } from "../data/dashboard.data";

export function GoalJourneyCard() {
  return (
    <section className="sf-card sf-journey">
      <div className="sf-section-header">
        <div>
          <h3>Camino de progreso</h3>
          <p>Aprender matemáticas · 1 año</p>
        </div>

        <span className="sf-stage-label">
          Etapa 3 de 5
        </span>
      </div>

      <div className="sf-journey-list">
        {goalStages.map((stage, index) => (
          <div
            className={`sf-journey-stage ${stage.status}`}
            key={stage.id}
          >
            <div className="sf-journey-track">
              <div className="sf-journey-diamond">
                {stage.status === "completed" && (
                  <Check size={22} />
                )}

                {stage.status === "current" && (
                  <Gem size={22} />
                )}

                {stage.status === "locked" && (
                  <LockKeyhole size={18} />
                )}
              </div>

              {index < goalStages.length - 1 && (
                <div className="sf-journey-line" />
              )}
            </div>

            <div className="sf-journey-info">
              <strong>
                {stage.id}. {stage.title}
              </strong>

              <p>{stage.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="sf-journey-reward">
        <Trophy size={24} />
        <span>Completa el recorrido para obtener tu logro.</span>
      </div>
    </section>
  );
}
