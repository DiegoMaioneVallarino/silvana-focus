
import { DailyOverview } from "../features/dashboard/components/DailyOverview";
import { GoalJourneyCard } from "../features/dashboard/components/GoalJourneyCard";
import { DailyStreakCard } from "../features/dashboard/components/DailyStreakCard";
import { ProjectsOverview } from "../features/dashboard/components/ProjectsOverview";
import { UpcomingReminders } from "../features/dashboard/components/UpcomingReminders";
import { TodaySchedule } from "../features/dashboard/components/TodaySchedule";

import { FocusTimer } from "../features/activity/components/FocusTimer";
import { ActivityHistory } from "../features/activity/components/ActivityHistory";

import { DashboardFinanceCard } from "../features/dashboard/components/DashboardFinanceCard";
import { DashboardTasksCard } from "../features/dashboard/components/DashboardTasksCard";
import { DashboardAcademyCard } from "../features/dashboard/components/DashboardAcademyCard";
import { DashboardProgressCard } from "../features/dashboard/components/DashboardProgressCard";
import { DashboardHabitsCard } from "../features/dashboard/components/DashboardHabitsCard";

import "./DashboardPage.css";

export function DashboardPage() {
  return (
    <div className="sf-dashboard-page">
      <div className="sf-dashboard-intro">
        <h2>Mi espacio</h2>
        <p>
          Organiza tu día, avanza en tus objetivos
          y descubre todo lo que has conseguido.
        </p>
      </div>

      <DailyOverview />

      <div className="sf-dashboard-main-grid">
        <GoalJourneyCard />
        <DailyStreakCard />
      </div>

      <div className="sf-dashboard-widget-grid">
        <DashboardFinanceCard />
        <DashboardTasksCard />
        <DashboardAcademyCard />
        <DashboardProgressCard />
        <DashboardHabitsCard />
      </div>

      <div className="sf-dashboard-main-grid">
        <FocusTimer />
        <TodaySchedule />
      </div>

      <div className="sf-dashboard-main-grid">
        <ProjectsOverview />
        <ActivityHistory />
      </div>

      <UpcomingReminders />
    </div>
  );
}
