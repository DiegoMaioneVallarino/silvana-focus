
import { useState } from "react";
import type { FormEvent } from "react";
import {
  PiggyBank,
  Plus,
  Trash2,
  Archive,
  RotateCcw,
} from "lucide-react";

import type { FinancialGoal } from "../financial-goals.types";
import { useFinancialGoalsStore } from "../financial-goals.store";
import { getFinancialGoalSummary } from "../financial-goals.utils";
import { formatMoney } from "../finances.utils";
import { toLocalDateKey } from "../../streaks/streaks.utils";
import { useGoalsStore } from "../../goals/goals.store";

export function FinancialGoalCard({
  goal,
}: {
  goal: FinancialGoal;
}) {
  const addContribution = useFinancialGoalsStore(
    (s) => s.addContribution
  );
  const removeContribution = useFinancialGoalsStore(
    (s) => s.removeContribution
  );
  const deleteGoal = useFinancialGoalsStore(
    (s) => s.deleteGoal
  );
  const archiveGoal = useFinancialGoalsStore(
    (s) => s.archiveGoal
  );
  const restoreGoal = useFinancialGoalsStore(
    (s) => s.restoreGoal
  );
  const goals = useGoalsStore((s) => s.goals);

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(
    toLocalDateKey(new Date())
  );

  const summary = getFinancialGoalSummary(goal);
  const linkedGoal = goals.find((g) => g.id === goal.goalId);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return;

    addContribution(goal.id, value, date, note.trim());
    setAmount("");
    setNote("");
  }

  return (
    <article className="sf-financial-goal-card sf-card">
      <div className="sf-financial-goal-heading">
        <div
          className="sf-financial-goal-icon"
          style={{ background: `${goal.color}18`, color: goal.color }}
        >
          <PiggyBank size={23} />
        </div>

        <div className="sf-financial-goal-heading-text">
          <h3>{goal.title}</h3>
          <p>{goal.description}</p>
          {linkedGoal && (
            <small>Objetivo: {linkedGoal.title}</small>
          )}
        </div>

        <button
          type="button"
          className="sf-finance-delete"
          title="Eliminar meta"
          onClick={() => {
            if (window.confirm("¿Eliminar esta meta y sus aportaciones?")) {
              deleteGoal(goal.id);
            }
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="sf-financial-goal-amounts">
        <div>
          <span>Ahorrado</span>
          <strong>{formatMoney(summary.saved)}</strong>
        </div>
        <div>
          <span>Objetivo</span>
          <strong>{formatMoney(goal.targetAmount)}</strong>
        </div>
      </div>

      <div className="sf-finance-progress">
        <div
          style={{
            width: `${summary.percentage}%`,
            background: goal.color,
          }}
        />
      </div>

      <div className="sf-financial-goal-details">
        <span>{summary.percentage}% completado</span>
        <span>
          Faltan {formatMoney(summary.remaining)}
        </span>
      </div>

      {summary.completed ? (
        <p className="sf-financial-success">
          ¡Meta de ahorro alcanzada! 🎉
        </p>
      ) : goal.targetDate ? (
        <p className="sf-financial-plan">
          {summary.monthlyRequired !== null
            ? `Ahorra aproximadamente ${formatMoney(
                summary.monthlyRequired
              )} al mes para llegar a tu meta.`
            : `El plazo previsto terminó o es este mes. Aún faltan ${formatMoney(
                summary.remaining
              )}.`}
        </p>
      ) : (
        <p className="sf-financial-plan">
          Agrega una fecha objetivo para calcular un plan mensual.
        </p>
      )}

      <div className="sf-financial-goal-details">
        <span>
          Fecha límite: {goal.targetDate ?? "Sin fecha"}
        </span>
        <button
          type="button"
          className="sf-academy-secondary"
          onClick={() =>
            goal.archivedAt
              ? restoreGoal(goal.id)
              : archiveGoal(goal.id)
          }
        >
          {goal.archivedAt ? (
            <RotateCcw size={14} />
          ) : (
            <Archive size={14} />
          )}
          {goal.archivedAt ? "Restaurar" : "Archivar"}
        </button>
      </div>

      {!goal.archivedAt && (
        <form className="sf-financial-contribution-form" onSubmit={submit}>
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Cantidad a ahorrar"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            placeholder="Nota (opcional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button type="submit" className="sf-finance-primary">
            <Plus size={16} />
            Aportar
          </button>
        </form>
      )}

      {goal.contributions.length > 0 && (
        <div className="sf-financial-contributions">
          <h4>Historial de aportaciones</h4>
          {[...goal.contributions].reverse().map((item) => (
            <div key={item.id} className="sf-financial-contribution">
              <div>
                <strong>+{formatMoney(item.amount)}</strong>
                <small>
                  {item.date}
                  {item.note ? ` · ${item.note}` : ""}
                </small>
              </div>
              <button
                type="button"
                className="sf-finance-delete"
                title="Eliminar aportación"
                onClick={() => {
                  if (window.confirm("¿Eliminar esta aportación?")) {
                    removeContribution(goal.id, item.id);
                  }
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
