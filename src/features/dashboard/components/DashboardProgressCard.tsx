
import { Link } from "react-router-dom";
import { Trophy, ArrowUpRight } from "lucide-react";

import { useProgressionStore } from "../../progression/progression.store";

import {
  calculateLevel,
  getActiveXP,
} from "../../progression/progression.utils";

export function DashboardProgressCard() {
  const rewards = useProgressionStore(
    (s) => s.rewards
  );

  const level = calculateLevel(
    getActiveXP(rewards)
  );

  return (
    <section className="sf-card sf-dashboard-widget">
      <div className="sf-dashboard-widget-header">
        <div className="sf-dashboard-widget-title">
          <Trophy size={19} color="#873cff" />
          <h3>Mi progreso</h3>
        </div>

        <Link to="/progress">
          <ArrowUpRight size={17} />
        </Link>
      </div>

      <span className="sf-dashboard-widget-label">
        {level.title}
      </span>

      <strong className="sf-dashboard-widget-value">
        Nivel {level.level}
      </strong>

      <div className="sf-finance-progress">
        <div
          style={{
            width: `${level.progressPercent}%`,
            background: "#873cff",
          }}
        />
      </div>

      <div className="sf-dashboard-widget-footer">
        <span>
          {level.totalXP} XP acumulados
        </span>
        <span>
          {level.progressPercent}%
        </span>
      </div>
    </section>
  );
}
