
import {
  CheckCircle2,
  Flame,
  Timer,
  Target,
  FolderCheck,
  BookOpen
} from "lucide-react";

import type { XPReward } from "../progression.types";

interface XPHistoryProps {
  rewards: XPReward[];
}

const sourceLabels = {
  task: "Tarea completada",
  habit: "Hábito registrado",
  focus: "Sesión de enfoque",
  goal_stage: "Etapa de objetivo",
  project: "Proyecto finalizado",
  academy_lesson: "Lección de Academia",
};

const sourceIcons = {
  task: CheckCircle2,
  habit: Flame,
  focus: Timer,
  goal_stage: Target,
  project: FolderCheck,
  academy_lesson: BookOpen,
};

export function XPHistory({
  rewards,
}: XPHistoryProps) {
  const sortedRewards = [...rewards].sort(
    (a, b) =>
      new Date(b.awardedAt).getTime() -
      new Date(a.awardedAt).getTime()
  );

  return (
    <section className="sf-card sf-xp-history">
      <h3>Historial de experiencia</h3>

      {sortedRewards.length === 0 ? (
        <p className="sf-muted">
          Completa tu primera actividad para ganar XP.
        </p>
      ) : (
        <div className="sf-xp-history-list">
          {sortedRewards.slice(0, 20).map((reward) => {
            const Icon = sourceIcons[reward.source];

            return (
              <div
                key={reward.id}
                className={[
                  "sf-xp-history-item",
                  !reward.active ? "inactive" : "",
                ].join(" ")}
              >
                <div className="sf-xp-history-icon">
                  <Icon size={18} />
                </div>

                <div className="sf-xp-history-description">
                  <strong>
                    {sourceLabels[reward.source]}
                  </strong>

                  <span>
                    {new Date(
                      reward.awardedAt
                    ).toLocaleString("es-MX", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {!reward.active && " · Invalidada"}
                  </span>
                </div>

                <strong className="sf-xp-history-amount">
                  {reward.active ? "+" : ""}
                  {reward.active ? reward.amount : 0} XP
                </strong>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
