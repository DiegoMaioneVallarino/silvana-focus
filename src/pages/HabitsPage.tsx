
import { Heart } from "lucide-react";

export function HabitsPage() {
  return (
    <section>
      <h2>Mis hábitos</h2>
      <p className="sf-muted">
        Pequeñas acciones, grandes resultados.
      </p>

      <div className="sf-card module-placeholder">
        <Heart size={32} color="#f43f73" />

        <h3>Construye tu constancia</h3>

        <p>
          Registra tus hábitos, horas de sueño,
          actividad física y rachas diarias.
        </p>
      </div>
    </section>
  );
}
