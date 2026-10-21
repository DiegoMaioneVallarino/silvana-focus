
import { FolderKanban } from "lucide-react";

export function ProjectPage() {
  return (
    <section>
      <h2>Mis proyectos</h2>
      <p className="sf-muted">
        Convierte tus ideas en resultados reales.
      </p>

      <div className="sf-card module-placeholder">
        <FolderKanban size={32} color="#ff5a12" />

        <h3>Organiza tus proyectos</h3>

        <p>
          Administra tareas, etapas, fechas límite
          y progreso de tus proyectos.
        </p>
      </div>
    </section>
  );
}
