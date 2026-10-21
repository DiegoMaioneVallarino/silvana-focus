
import { useState } from "react";
import { Plus, X, PiggyBank } from "lucide-react";
import { useFinancialGoalsStore } from "../financial-goals.store";
import { FinancialGoalForm } from "./FinancialGoalForm";
import { FinancialGoalCard } from "./FinancialGoalCard";

export function FinancialGoalsPanel() {
  const goals = useFinancialGoalsStore((s) => s.goals);
  const [showForm, setShowForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const visibleGoals = goals.filter(
    (goal) => Boolean(goal.archivedAt) === showArchived
  );

  return (
    <section className="sf-financial-goals-panel">
      <div className="sf-financial-panel-header">
        <div>
          <h3>Metas financieras</h3>
          <p className="sf-muted">
            Convierte tus objetivos económicos en planes de ahorro.
          </p>
        </div>

        <button
          type="button"
          className="sf-finance-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cerrar" : "Nueva meta"}
        </button>
      </div>

      {showForm && (
        <FinancialGoalForm onCreated={() => setShowForm(false)} />
      )}

      <div className="sf-financial-tabs">
        <button
          type="button"
          className={!showArchived ? "active" : ""}
          onClick={() => setShowArchived(false)}
        >
          Activas
        </button>
        <button
          type="button"
          className={showArchived ? "active" : ""}
          onClick={() => setShowArchived(true)}
        >
          Archivadas
        </button>
      </div>

      {visibleGoals.length === 0 ? (
        <div className="sf-card sf-financial-empty">
          <PiggyBank size={32} color="#873cff" />
          <h4>
            {showArchived
              ? "No tienes metas archivadas"
              : "Tu primera meta financiera"}
          </h4>
          <p className="sf-muted">
            {showArchived
              ? "Las metas archivadas aparecerán aquí."
              : "Crea una meta y empieza a registrar tus aportaciones."}
          </p>
        </div>
      ) : (
        <div className="sf-financial-goals-grid">
          {visibleGoals.map((goal) => (
            <FinancialGoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </section>
  );
}
