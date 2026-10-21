
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

import { useProjectsStore } from "../features/projects/projects.store";
import { useTasksStore } from "../features/tasks/tasks.store";
import { getProjectProgress } from "../features/projects/projects.utils";
import { ProjectForm } from "../features/projects/components/ProjectForm";
import { ProjectTasks } from "../features/projects/components/ProjectTasks";

import type { ProjectStatus } from "../features/projects/projects.types";

import "./ProjectsPage.css";

const statuses: {
  value: ProjectStatus;
  label: string;
}[] = [
  { value: "planning", label: "Planificación" },
  { value: "active", label: "Activo" },
  { value: "paused", label: "Pausado" },
  { value: "completed", label: "Finalizado" },
];

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const projects = useProjectsStore(
    (state) => state.projects
  );
  const updateProject = useProjectsStore(
    (state) => state.updateProject
  );
  const deleteProject = useProjectsStore(
    (state) => state.deleteProject
  );

  const tasks = useTasksStore((state) => state.tasks);
  const setTaskProject = useTasksStore(
    (state) => state.setTaskProject
  );

  const [editing, setEditing] = useState(false);

  const project = projects.find(
    (item) => item.id === projectId
  );

  if (!project) {
    return (
      <div className="sf-projects-page">
        <h2>Proyecto no encontrado</h2>
        <Link to="/projects">Volver a proyectos</Link>
      </div>
    );
  }

  const progress = getProjectProgress(tasks, project.id);

  function handleDelete() {
    if (!project) return;

    if (
      !window.confirm(
        `¿Eliminar el proyecto "${project.name}"? Las tareas se conservarán.`
      )
    ) {
      return;
    }

    // Desvincular tareas antes de eliminar el proyecto.
    tasks
      .filter((task) => task.projectId === project.id)
      .forEach((task) => setTaskProject(task.id, null));

    deleteProject(project.id);
    navigate("/projects");
  }

  return (
    <div className="sf-projects-page">
      <Link to="/projects" className="sf-project-back">
        <ArrowLeft size={17} />
        Todos los proyectos
      </Link>

      <header className="sf-projects-header">
        <div>
          <h2>{project.name}</h2>
          <p className="sf-muted">{project.description}</p>
        </div>

        <div className="sf-project-header-actions">
          <button
            onClick={() => setEditing(!editing)}
            title="Editar proyecto"
          >
            <Pencil size={17} />
          </button>

          <button
            onClick={handleDelete}
            title="Eliminar proyecto"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </header>

      {editing && (
        <section className="sf-card sf-project-form-panel">
          <h3>Editar proyecto</h3>
          <ProjectForm project={project} />
          <button
            type="button"
            onClick={() => setEditing(false)}
          >
            Cerrar edición
          </button>
        </section>
      )}

      <section className="sf-card sf-project-detail-summary">
        <div className="sf-project-detail-top">
          <div>
            <span className="sf-muted">Progreso general</span>
            <h3>{progress.percentage}%</h3>
          </div>

          <label>
            Estado
            <select
              value={project.status}
              onChange={(event) =>
                updateProject(project.id, {
                  status: event.target.value as ProjectStatus,
                })
              }
            >
              {statuses.map((status) => (
                <option
                  key={status.value}
                  value={status.value}
                >
                  {status.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="sf-project-progress-track">
          <div
            style={{
              width: `${progress.percentage}%`,
              background: project.color,
            }}
          />
        </div>

        <div className="sf-project-detail-stats">
          <div>
            <strong>{progress.total}</strong>
            <span>Tareas totales</span>
          </div>

          <div>
            <strong>{progress.inProgress}</strong>
            <span>En progreso</span>
          </div>

          <div>
            <strong>{progress.completed}</strong>
            <span>Completadas</span>
          </div>

          <div>
            <strong>{progress.pending}</strong>
            <span>Pendientes</span>
          </div>
        </div>

        {project.dueDate && (
          <p className="sf-muted">
            Fecha límite: {project.dueDate}
          </p>
        )}
      </section>

      <section className="sf-card sf-project-tasks-panel">
        <ProjectTasks
          projectId={project.id}
          goalId={project.goalId}
        />
      </section>
    </div>
  );
}
