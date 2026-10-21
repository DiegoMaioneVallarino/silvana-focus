
import { Target } from "lucide-react";

export function GoalsPage() {
  return (
    <section>
      <h2>Mis objetivos</h2>
      <p className="sf-muted">
        Convierte tus metas en recorridos de progreso.
      </p>

      <div className="sf-card module-placeholder">
        <Target size={32} color="#873cff" />

        <h3>Construye tu futuro</h3>

        <p>
          Crea objetivos, define etapas y avanza
          a través de recorridos personalizados.
        </p>
      </div>
    </section>
  );
}
