
import { useState } from "react";
import type { FormEvent } from "react";

import { Trash2 } from "lucide-react";

import type {
  Transaction,
  TransactionCategory,
} from "../finances.types";

import { useFinancesStore } from "../finances.store";

import {
  expenseCategories,
  financeCategories,
  formatMoney,
  getBudgetProgress,
} from "../finances.utils";

interface BudgetPanelProps {
  month: string;
  transactions: Transaction[];
}

export function BudgetPanel({
  month,
  transactions,
}: BudgetPanelProps) {
  const budgets = useFinancesStore(
    (state) => state.budgets
  );

  const setBudget = useFinancesStore(
    (state) => state.setBudget
  );

  const deleteBudget = useFinancesStore(
    (state) => state.deleteBudget
  );

  const [category, setCategory] =
    useState<TransactionCategory>("food");

  const [limit, setLimit] = useState("");

  const monthlyBudgets = budgets.filter(
    (budget) => budget.month === month
  );

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const value = Number(limit);

    if (
      !Number.isFinite(value) ||
      value <= 0
    ) {
      return;
    }

    setBudget(category, value, month);
    setLimit("");
  }

  return (
    <section className="sf-finance-budgets sf-card">
      <h3>Presupuestos</h3>

      <form
        className="sf-finance-budget-form"
        onSubmit={handleSubmit}
      >
        <select
          value={category}
          onChange={(event) =>
            setCategory(
              event.target.value as TransactionCategory
            )
          }
        >
          {expenseCategories.map((item) => (
            <option
              key={item}
              value={item}
            >
              {financeCategories[item].label}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Límite mensual"
          value={limit}
          onChange={(event) =>
            setLimit(event.target.value)
          }
          required
        />

        <button
          type="submit"
          className="sf-finance-primary"
        >
          Guardar
        </button>
      </form>

      <div className="sf-finance-budget-list">
        {monthlyBudgets.map((budget) => {
          const result = getBudgetProgress(
            budget,
            transactions
          );

          const config =
            financeCategories[budget.category];

          return (
            <div
              key={budget.id}
              className="sf-finance-budget-item"
            >
              <div className="sf-finance-budget-header">
                <strong>
                  {config.emoji} {config.label}
                </strong>

                <button
                  type="button"
                  className="sf-finance-delete"
                  onClick={() =>
                    deleteBudget(budget.id)
                  }
                  title="Eliminar presupuesto"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="sf-finance-progress">
                <div
                  style={{
                    width: `${Math.min(
                      result.percentage,
                      100
                    )}%`,
                    background: result.exceeded
                      ? "#ef6464"
                      : config.color,
                  }}
                />
              </div>

              <div className="sf-finance-budget-footer">
                <span>
                  {formatMoney(result.spent)} gastados
                </span>

                <span>
                  {formatMoney(budget.limit)} límite
                </span>
              </div>

              {result.exceeded && (
                <small className="sf-finance-negative">
                  Presupuesto excedido por{" "}
                  {formatMoney(
                    Math.abs(result.remaining)
                  )}
                </small>
              )}
            </div>
          );
        })}

        {monthlyBudgets.length === 0 && (
          <p className="sf-muted">
            Todavía no has establecido presupuestos.
          </p>
        )}
      </div>
    </section>
  );
}
