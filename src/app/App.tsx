
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";

import { DashboardPage } from "../pages/DashboardPage";
import { GoalsPage } from "../pages/GoalsPage";
import { CalendarPage } from "../pages/CalendarPage";
import { HabitsPage } from "../pages/HabitsPage";
import { TasksPage } from "../pages/TasksPage";

import { ProjectsPage } from "../pages/ProjectsPage";
import { ProjectDetailPage } from "../pages/ProjectDetailPage";

import { ProgressPage } from "../pages/ProgressPage";
import { StatisticsPage } from "../pages/StatisticsPage";

import { FinancesPage } from "../pages/FinancesPage";
import { AcademyPage } from "../pages/AcademyPage";
import { CoursePage } from "../pages/CoursePage";
import { PlannerPage } from "../pages/PlannerPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          {/* Dashboard */}
          <Route
            path="/"
            element={<DashboardPage />}
          />

          {/* Productividad */}
          <Route
            path="goals"
            element={<GoalsPage />}
          />

          <Route
            path="calendar"
            element={<CalendarPage />}
          />

          <Route
            path="habits"
            element={<HabitsPage />}
          />

          <Route
            path="tasks"
            element={<TasksPage />}
          />

          {/* Proyectos */}
          <Route
            path="projects"
            element={<ProjectsPage />}
          />

          <Route
            path="projects/:projectId"
            element={<ProjectDetailPage />}
          />

          {/* Progreso y estadísticas */}
          <Route
            path="progress"
            element={<ProgressPage />}
          />

          <Route
            path="statistics"
            element={<StatisticsPage />}
          />

          {/* Finanzas */}
          <Route
            path="finances"
            element={<FinancesPage />}
          />

         {/* Planeación */}
          <Route path="planner" element={<PlannerPage />}
          
          />
          {/* Academia */}
          <Route
            path="academy"
            element={<AcademyPage />}
          />
          <Route
                path="academy/:courseId"
                element={<CoursePage />}
                />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
