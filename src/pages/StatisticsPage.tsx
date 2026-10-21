
import { useState } from "react";

import type {
  StatisticsPeriod,
} from "../features/statistics/statistics.types";

import {
  getDailyFocusData,
  getProductivityStats,
  getCategoryTimeData,
} from "../features/statistics/statistics.utils";

import { StatisticsOverview } from "../features/statistics/components/StatisticsOverview";
import { FocusChart } from "../features/statistics/components/FocusChart";
import { ProductivityBreakdown } from "../features/statistics/components/ProductivityBreakdown";

import { useActivityStore } from "../features/activity/activity.store";
import { useTasksStore } from "../features/tasks/tasks.store";
import { useHabitsStore } from "../features/habits/habits.store";
import { useProjectsStore } from "../features/projects/projects.store";
import { useProgressionStore } from "../features/progression/progression.store";

import "./StatisticsPage.css";

export function StatisticsPage() {
  const [period, setPeriod] =
    useState<StatisticsPeriod>("week");

  const sessions = useActivityStore(
    (state) => state.sessions
  );

  const tasks = useTasksStore(
    (state) => state.tasks
  );

  const habits = useHabitsStore(
    (state) => state.habits
  );

  const projects = useProjectsStore(
    (state) => state.projects
  );

  const rewards = useProgressionStore(
    (state) => state.rewards
  );

  const stats = getProductivityStats(
    sessions,
    tasks,
    habits,
    projects,
    rewards,
    period
  );

  const focusData = getDailyFocusData(
    sessions,
    period === "all" ? "week" : period
  );

  const categoryData = getCategoryTimeData(
    sessions,
    period
  );

  return (
    <div className="sf-statistics-page">
      <header className="sf-statistics-header">
        <div>
          <h2>Estadísticas</h2>
          <p className="sf-muted">
            Comprende cómo estás avanzando.
          </p>
        </div>

        <div className="sf-statistics-periods">
          {(
            [
              ["week", "7 días"],
              ["month", "30 días"],
              ["all", "Todo"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              className={
                period === value ? "active" : ""
              }
              onClick={() => setPeriod(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <StatisticsOverview stats={stats} />

      <div className="sf-statistics-grid">
        <FocusChart data={focusData} />

        <ProductivityBreakdown
          data={categoryData}
        />
      </div>

      <section className="sf-card sf-statistics-extra">
        <h3>Resumen de proyectos</h3>

        <div>
          <span>Proyectos finalizados</span>
          <strong>{stats.completedProjects}</strong>
        </div>

        <div>
          <span>Proyectos registrados</span>
          <strong>{stats.totalProjects}</strong>
        </div>
      </section>
    </div>
  );
}
