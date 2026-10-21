
import { Link } from "react-router-dom";
import { dashboardProjects } from "../data/dashboard.data";

export function ProjectsOverview() {
  return (
    <section className="sf-card sf-projects-overview">
      <div className="sf-section-header">
        <div>
          <h3>Tus proyectos</h3>
          <p>Convierte tus ideas en resultados.</p>
        </div>

        <Link to="/projects">Ver todos →</Link>
      </div>

      <div className="sf-projects-list">
        {dashboardProjects.map((project) => (
          <div className="sf-project-item" key={project.id}>
            <strong>{project.name}</strong>

            <p>{project.description}</p>

            <div className="sf-progress-row">
              <div className="sf-progress-track">
                <div
                  className="sf-progress-fill"
                  style={{ width: `${project.progress}%` }}
                />
              </div>

              <span>{project.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
