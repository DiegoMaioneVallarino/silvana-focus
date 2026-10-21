
import { DailyOverview } from "../features/dashboard/components/DailyOverview";
import { GoalJourneyCard } from "../features/dashboard/components/GoalJourneyCard";
import { DailyStreakCard } from "../features/dashboard/components/DailyStreakCard";
import { TodaySchedule } from "../features/dashboard/components/TodaySchedule";
import { ProjectsOverview } from "../features/dashboard/components/ProjectsOverview";
import { UpcomingReminders } from "../features/dashboard/components/UpcomingReminders";
import { FocusTimer } from "../features/activity/components/FocusTimer";
import { ActivityHistory } from "../features/activity/components/ActivityHistory";
import "../features/dashboard/DashboardPage.css";

export function DashboardPage() {
  return (
    <div className="sf-dashboard">
      <DailyOverview />

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
    </div>
  );
}
