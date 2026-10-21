
import {
  Sun,
  CircleCheck,
  ChartNoAxesCombined,
  Heart,
} from "lucide-react";

import { dashboardStats } from "../data/dashboard.data";
import { useActivityStore } from "../../activity/activity.store";

import {
  getTodaySessions,
  getTotalSeconds,
  formatDuration,
} from "../../activity/activity.utils";


const icons = {
  focus: Sun,
  tasks: CircleCheck,
  projects: ChartNoAxesCombined,
  habits: Heart,
};

export function DailyOverview() {

    const sessions = useActivityStore(
  (state) => state.sessions
);

const todaySessions = getTodaySessions(sessions);

const focusTime = formatDuration(
  getTotalSeconds(todaySessions)
);
  return (
    <div className="sf-stats-grid">
      {dashboardStats.map((stat) => {
        const Icon = icons[
          stat.id as keyof typeof icons
        ];

        return (
          <div
            key={stat.id}
            className={`sf-card sf-stat-card ${stat.color}`}
          >
            <div className="sf-stat-icon">
              <Icon size={25} />
            </div>

            <div>
              <span className="sf-stat-label">
                {stat.label}
              </span>

                <strong>
                {stat.id === "focus" ? focusTime : stat.value}
                </strong>
              <small>{stat.detail}</small>
            </div>
          </div>
        );
      })}
    </div>
  );
}
