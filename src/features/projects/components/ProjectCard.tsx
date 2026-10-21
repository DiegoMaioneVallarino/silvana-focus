
import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import type { Project } from "../projects.types";
import { getProjectProgress } from "../projects.utils";
import { useTasksStore } from "../../tasks/tasks.store";

const statusLabels = {
  planning: "Planificación",
  active: "Activo",
  paused: "Pausado",
  completed: "Finalizado",
};

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const tasks = useTasksStore((state) => state.tasks);
  const progress = getProjectProgress(tasks, project.id);

  return (
    <Link
      to={`/projects/${project.id}`}
      className="sf-project-card"
      style={{
        borderTop: `4px solid ${project.color}`,
      }}
    >
      <div className="sf-project-card-heading">
        <span
          className="sf-project-card-symbol"
          style={{
            background: `${project.color}18`,
            color: project.color,
          }}
        >
          <CheckCircle2 size={21} />
        </span>

        <ArrowUpRight size={18} />
      </div>

      <h3>{project.name}</h3>
      <p>{project.description || "Sin descripción"}</p>

      <span className="sf-project-status">
        {statusLabels[project.status]}
      </span>

      <div className="sf-project-progress-heading">
        <span>Progreso</span>
        <strong>{progress.percentage}%</strong>
      </div>

      <div className="sf-project-progress-track">
        <div
          style={{
            width: `${progress.percentage}%`,
            background: project.color,
          }}
        />
      </div>

      <small>
        {progress.completed} de {progress.total} tareas
        completadas
      </small>
    </Link>
  );
}
