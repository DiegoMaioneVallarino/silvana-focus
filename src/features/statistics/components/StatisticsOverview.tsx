
import {
  Timer,
  CheckCircle2,
  Flame,
  Zap,
} from "lucide-react";

import type { ProductivityStats } from "../statistics.types";

import {
  formatStatisticsDuration,
} from "../statistics.utils";

interface StatisticsOverviewProps {
  stats: ProductivityStats;
}

export function StatisticsOverview({
  stats,
}: StatisticsOverviewProps) {
  const habitRate =
    stats.scheduledHabitChecks === 0
      ? 0
      : Math.round(
          (stats.completedHabitChecks /
            stats.scheduledHabitChecks) *
            100
        );

  const items = [
    {
      label: "Tiempo de enfoque",
      value: formatStatisticsDuration(
        stats.totalFocusSeconds
      ),
      icon: Timer,
      color: "#873cff",
    },
    {
      label: "Tareas completadas",
      value: String(stats.completedTasks),
      icon: CheckCircle2,
      color: "#20b879",
    },
    {
      label: "Cumplimiento de hábitos",
      value: `${habitRate}%`,
      icon: Flame,
      color: "#ff5a12",
    },
    {
      label: "Experiencia obtenida",
      value: `${stats.earnedXP} XP`,
      icon: Zap,
      color: "#3d73ff",
    },
  ];

  return (
    <div className="sf-statistics-overview">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            className="sf-card sf-statistics-metric"
            key={item.label}
          >
            <Icon size={21} color={item.color} />
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        );
      })}
    </div>
  );
}
