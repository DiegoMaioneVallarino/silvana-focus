
import { DailyOverview } from "../features/dashboard/components/DailyOverview";
import { GoalJourneyCard } from "../features/dashboard/components/GoalJourneyCard";
import { DailyStreakCard } from "../features/dashboard/components/DailyStreakCard";
import { TodaySchedule } from "../features/dashboard/components/TodaySchedule";
import { ProjectsOverview } from "../features/dashboard/components/ProjectsOverview";
import { UpcomingReminders } from "../features/dashboard/components/UpcomingReminders";

import { FocusTimer } from "../features/activity/components/FocusTimer";
import { ActivityHistory } from "../features/activity/components/ActivityHistory";

import { DashboardFinanceCard } from "../features/dashboard/components/DashboardFinanceCard";
import { DashboardTasksCard } from "../features/dashboard/components/DashboardTasksCard";
import { DashboardAcademyCard } from "../features/dashboard/components/DashboardAcademyCard";
import { DashboardProgressCard } from "../features/dashboard/components/DashboardProgressCard";
import { DashboardHabitsCard } from "../features/dashboard/components/DashboardHabitsCard";

// Estilos originales del dashboard
import "../features/dashboard/DashboardPage.css";

// Estilos adicionales de componentes originales
import "../features/dashboard/components/DashboardPage.css";

// Estilos de los widgets nuevos
import "./DashboardPage.css";

export function DashboardPage() {
  return (
    <div className="sf-dashboard">
      <DailyOverview />

      {/* GRID ORIGINAL */}
      <div className="sf-dashboard-grid">
        <div className="sf-dashboard-left">
          <GoalJourneyCard />
          <DailyStreakCard />
        </div>

        <div className="sf-dashboard-center">
          <FocusTimer />
          <ProjectsOverview />
          <ActivityHistory />
          <UpcomingReminders />
        </div>

        <div className="sf-dashboard-right">
          <TodaySchedule />
        </div>
      </div>

      {/* WIDGETS NUEVOS: FUERA DEL GRID ORIGINAL */}
      <section className="sf-dashboard-extra">
        <div className="sf-dashboard-extra-heading">
          <h3>Mi actividad</h3>
          <span>Resumen de tus otras áreas</span>
        </div>

        <div className="sf-dashboard-extra-grid">
          <DashboardFinanceCard />
          <DashboardTasksCard />
          <DashboardAcademyCard />
          <DashboardProgressCard />
          <DashboardHabitsCard />
        </div>
      </section>
    </div>
  );
}
