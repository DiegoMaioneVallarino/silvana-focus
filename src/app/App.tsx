
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";

import { DashboardPage } from "../pages/DashboardPage";
import { GoalsPage } from "../pages/GoalsPage";
import { ProjectPage } from "../pages/ProjectPage";
import { CalendarPage } from "../pages/CalendarPage";
import { HabitsPage } from "../pages/HabitsPage";
import { FinancesPage } from "../pages/FinancesPage";
import { AcademyPage } from "../pages/AcademyPage";
import { StatisticsPage } from "../pages/StatisticsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/finances" element={<FinancesPage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
