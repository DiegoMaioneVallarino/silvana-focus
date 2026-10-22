
import { NavLink } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import {
  House,
  CalendarDays,
  Target,
  FolderKanban,
  Heart,
  Wallet,
  GraduationCap,
  ChartNoAxesCombined,
  ListTodo,
  Flame,
  Settings,
  Trophy
} from "lucide-react";

import "./Sidebar.css";

const navigation = [
  { label: "Hoy", path: "/", icon: House },
  { label: "Agenda", path: "/calendar", icon: CalendarDays },
    {label: "Planificador",path: "/planner",icon: CalendarClock,},
  { label: "Objetivos", path: "/goals", icon: Target },
  { label: "Proyectos", path: "/projects", icon: FolderKanban },
  { label: "Tareas", path: "/tasks", icon: ListTodo },
  {label: "Mi progreso",path: "/progress",icon: Trophy,},
  { label: "Hábitos", path: "/habits", icon: Heart },
  { label: "Finanzas", path: "/finances", icon: Wallet },
  { label: "Academia", path: "/academy", icon: GraduationCap },
];

export function Sidebar() {
  return (
    <aside className="sf-sidebar">
      <div className="sf-brand">
        <div className="sf-brand-icon">
          <Flame size={24} />
        </div>

        <span>Silvana Focus</span>
      </div>

      <nav className="sf-navigation">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `sf-nav-item ${isActive ? "active" : ""}`
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sf-sidebar-bottom">
        <NavLink to="/statistics" className="sf-nav-item">
          <ChartNoAxesCombined size={19} />
          <span>Estadísticas</span>
        </NavLink>

        <div className="sf-nav-item">
          <Settings size={19} />
          <span>Ajustes</span>
        </div>
      </div>
    </aside>
  );
}
