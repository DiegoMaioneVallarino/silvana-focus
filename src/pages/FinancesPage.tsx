
import { Wallet } from "lucide-react";

export function FinancesPage() {
  return (
    <section>
      <h2>Mis finanzas</h2>
      <p className="sf-muted">
        Mantén tus compromisos económicos bajo control.
      </p>

      <div className="sf-card module-placeholder">
        <Wallet size={32} color="#20b879" />

        <h3>Control financiero</h3>

        <p>
          Organiza pagos, gastos, suscripciones
          y recordatorios financieros.
        </p>
      </div>
    </section>
  );
}
