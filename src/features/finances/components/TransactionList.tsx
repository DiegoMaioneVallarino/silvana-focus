
import { Trash2 } from "lucide-react";

import type {
  Transaction,
} from "../finances.types";

import { useFinancesStore } from "../finances.store";

import {
  financeCategories,
  formatMoney,
} from "../finances.utils";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({
  transactions,
}: TransactionListProps) {
  const deleteTransaction = useFinancesStore(
    (state) => state.deleteTransaction
  );

  const sorted = [...transactions].sort(
    (a, b) =>
      b.date.localeCompare(a.date) ||
      b.createdAt.localeCompare(a.createdAt)
  );

  return (
    <section className="sf-finance-transactions sf-card">
      <h3>Movimientos</h3>

      {sorted.length === 0 ? (
        <p className="sf-muted">
          Todavía no hay transacciones en este mes.
        </p>
      ) : (
        <div className="sf-finance-transaction-list">
          {sorted.map((transaction) => {
            const category =
              financeCategories[
                transaction.category
              ];

            return (
              <div
                key={transaction.id}
                className="sf-finance-transaction"
              >
                <div className="sf-finance-transaction-icon">
                  {category.emoji}
                </div>

                <div className="sf-finance-transaction-info">
                  <strong>
                    {transaction.title}
                  </strong>

                  <span>
                    {category.label}
                    {" · "}
                    {transaction.date}
                  </span>
                </div>

                <strong
                  className={
                    transaction.type === "income"
                      ? "sf-finance-positive"
                      : "sf-finance-negative"
                  }
                >
                  {transaction.type === "income"
                    ? "+"
                    : "-"}
                  {formatMoney(transaction.amount)}
                </strong>

                <button
                  type="button"
                  className="sf-finance-delete"
                  title="Eliminar transacción"
                  onClick={() => {
                    if (
                      window.confirm(
                        "¿Eliminar este movimiento?"
                      )
                    ) {
                      deleteTransaction(
                        transaction.id
                      );
                    }
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
