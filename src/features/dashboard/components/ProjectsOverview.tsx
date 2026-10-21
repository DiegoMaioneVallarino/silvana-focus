
import { Link } from "react-router-dom";
import { FolderKanban } from "lucide-react";

import { useProjectsStore } from "../../projects/projects.store";
import { useTasksStore } from "../../tasks/tasks.store";
import { getProjectProgress } from "../../projects/projects.utils";

export function ProjectsOverview() {
  const projects = useProjectsStore(
    (state) => state.projects
  );
  const tasks = useTasksStore((state) => state.tasks);

  const visibleProjects = projects
    .filter((project) => project.status !== "completed")
    .slice(0, 3);

  return (
    <section className="sf-card sf-projects-overview">
      <div className="sf-section-header">
        <div>
          <h3>Mis proyectos</h3>
          <p>Continúa construyendo tus ideas.</p>
        </div>

        <Link to="/projects">Ver todos →</Link>
      </div>

      {visibleProjects.length === 0 ? (
        <div style={{ padding: "20px 0" }}>
          <p className="sf-muted">
            Todavía no tienes proyectos activos.
          </p>

          <Link to="/projects">
            Crear mi primer proyecto →
          </Link>
        </div>
      ) : (
        <div className="sf-projects-overview-list">
          {visibleProjects.map((project) => {
            const progress = getProjectProgress(
              tasks,
              project.id
            );

            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                style={{
                  display: "block",
                  padding: "15px 0",
                  textDecoration: "none",
                  color: "inherit",
                  borderBottom: "1px solid #e8edf6",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <FolderKanban
                    size={18}
                    color={project.color}
                  />

                  <strong style={{ flex: 1 }}>
                    {project.name}
                  </strong>

                  <span>{progress.percentage}%</span>
                </div>

                <div
                  style={{
                    height: 7,
                    background: "#edf1f7",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progress.percentage}%`,
                      height: "100%",
                      background: project.color,
                      borderRadius: 10,
                    }}
                  />
                </div>

                <small className="sf-muted">
                  {progress.completed} de {progress.total} tareas
                </small>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
