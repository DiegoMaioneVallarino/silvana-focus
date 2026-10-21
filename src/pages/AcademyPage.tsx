
import { GraduationCap } from "lucide-react";

export function AcademyPage() {
  return (
    <section>
      <h2>Academia</h2>
      <p className="sf-muted">
        Aprende nuevas habilidades a tu propio ritmo.
      </p>

      <div className="sf-card module-placeholder">
        <GraduationCap size={32} color="#873cff" />

        <h3>Tu espacio de aprendizaje</h3>

        <p>
          Accede a lecciones, ejercicios,
          evaluaciones y rutas de estudio.
        </p>
      </div>
    </section>
  );
}
