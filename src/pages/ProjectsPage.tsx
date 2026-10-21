
import { useState } from "react";
import { Plus, X } from "lucide-react";

import { useProjectsStore } from "../features/projects/projects.store";
import { ProjectCard } from "../features/projects/components/ProjectCard";
import { ProjectForm } from "../features/projects/components/ProjectForm";

import "./ProjectsPage.css";

export function ProjectsPage() {
  const projects = useProjectsStore(
    (state) => state.projects
  );

  const [showForm, setShowForm] = useState(false);

  return (
    <div className="sf-projects-page">
      <header className="sf-projects-header">
        <div>
          <h2>Mis proyectos</h2>
          <p className="sf-muted">
            Convierte tus ideas en resultados concretos.
          </p>
        </div>

        <button
          className="sf-project-primary-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X size={17} /> : <Plus size={17} />}
          {showForm ? "Cerrar" : "Nuevo proyecto"}
        </button>
      </header>

      {showForm && (
        <section className="sf-card sf-project-form-panel">
          <h3>Crear proyecto</h3>
          <ProjectForm />
        </section>
      )}

      {projects.length === 0 ? (
        <section className="sf-card sf-project-empty">
          <h3>Tu próximo gran proyecto comienza aquí.</h3>
          <p>
            Crea un proyecto y organiza sus tareas
            para comenzar a avanzar.
          </p>
        </section>
      ) : (
        <div className="sf-projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      )}
    </div>
  );
}
