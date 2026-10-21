
import type {
  ExpenseCategoryData,
} from "../finances.types";

import {
  financeCategories,
  formatMoney,
} from "../finances.utils";

interface ExpenseBreakdownProps {
  data: ExpenseCategoryData[];
}

export function ExpenseBreakdown({
  data,
}: ExpenseBreakdownProps) {
  return (
    <section className="sf-finance-breakdown sf-card">
      <h3>¿En qué gastas?</h3>

      {data.length === 0 ? (
        <p className="sf-muted">
          Registra gastos para ver su distribución.
        </p>
      ) : (
        <div className="sf-finance-breakdown-list">
          {data.map((item) => {
            const config =
              financeCategories[item.category];

            return (
              <div
                key={item.category}
                className="sf-finance-breakdown-item"
              >
                <div className="sf-finance-breakdown-label">
                  <span>
                    {config.emoji} {config.label}
                  </span>

                  <strong>
                    {formatMoney(item.amount)}
                  </strong>
                </div>

                <div className="sf-finance-progress">
                  <div
                    style={{
                      width: `${item.percentage}%`,
                      background: config.color,
                    }}
                  />
                </div>

                <small>
                  {item.percentage}% del gasto total
                </small>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
