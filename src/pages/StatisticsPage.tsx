
import { ChartNoAxesCombined } from "lucide-react";

export function StatisticsPage() {
  return (
    <section>
      <h2>Mis estadísticas</h2>
      <p className="sf-muted">
        Comprende cómo estás avanzando.
      </p>

      <div className="sf-card module-placeholder">
        <ChartNoAxesCombined
          size={32}
          color="#3d73ff"
        />

        <h3>Analiza tu progreso</h3>

        <p>
          Consulta tu productividad, constancia,
          tiempo invertido y objetivos alcanzados.
        </p>
      </div>
    </section>
  );
}
