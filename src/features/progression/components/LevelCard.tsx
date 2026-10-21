
import { Trophy, Zap, TrendingUp } from "lucide-react";

import type { LevelInfo } from "../progression.types";

interface LevelCardProps {
  level: LevelInfo;
  todayXP: number;
  lifetimeXP: number;
}

export function LevelCard({
  level,
  todayXP,
  lifetimeXP,
}: LevelCardProps) {
  return (
    <section className="sf-card sf-level-card">
      <div className="sf-level-header">
        <div className="sf-level-icon">
          <Trophy size={28} />
        </div>

        <div>
          <span className="sf-progress-eyebrow">
            TU PROGRESO PERSONAL
          </span>

          <h2>
            Nivel {level.level} — {level.title}
          </h2>

          <p>
            {level.totalXP.toLocaleString()} XP activos
          </p>
        </div>
      </div>

      <div className="sf-level-progress">
        <div className="sf-level-progress-label">
          <strong>
            Progreso al nivel {level.level + 1}
          </strong>

          <span>
            {level.progressXP} / {level.requiredXP} XP
          </span>
        </div>

        <div
          className="sf-level-progress-track"
          role="progressbar"
          aria-valuenow={level.progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            style={{
              width: `${level.progressPercent}%`,
            }}
          />
        </div>
      </div>

      <div className="sf-level-stats">
        <div>
          <Zap size={20} color="#ff5a12" />
          <strong>+{todayXP}</strong>
          <span>XP de hoy</span>
        </div>

        <div>
          <TrendingUp size={20} color="#873cff" />
          <strong>
            {lifetimeXP.toLocaleString()}
          </strong>
          <span>XP histórico</span>
        </div>
      </div>
    </section>
  );
}
