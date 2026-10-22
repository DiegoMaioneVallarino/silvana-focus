
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

import "../features/dashboard/DashboardPage.css";
import "../features/dashboard/components/DashboardPage.css";
import "./DashboardPage.css";

export function DashboardPage() {
  return (
    <div className="sf-dashboard sf-dashboard-v2">
      <DailyOverview />

      <div className="sf-dashboard-grid">
        <div className="sf-dashboard-left">
          <GoalJourneyCard />
          <DailyStreakCard />
          <DashboardProgressCard />
        </div>

        <div className="sf-dashboard-center">
          <FocusTimer />
          <ProjectsOverview />

          <div className="sf-dashboard-mini-grid">
            <DashboardFinanceCard />
            <DashboardAcademyCard />
          </div>

          <ActivityHistory />
        </div>

        <div className="sf-dashboard-right">
          <TodaySchedule />

          <div className="sf-dashboard-side-widgets">
            <DashboardTasksCard />
            <DashboardHabitsCard />
          </div>

          <UpcomingReminders />
        </div>
      </div>
    </div>
  );
}
