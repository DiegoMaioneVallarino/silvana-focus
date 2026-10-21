
import { useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Wallet,
} from "lucide-react";

import { useFinancesStore } from "../features/finances/finances.store";

import {
  getMonthKey,
  getMonthlyTransactions,
  getFinanceSummary,
  getExpenseBreakdown,
} from "../features/finances/finances.utils";

import { FinanceOverview } from "../features/finances/components/FinanceOverview";
import { TransactionForm } from "../features/finances/components/TransactionForm";
import { TransactionList } from "../features/finances/components/TransactionList";
import { ExpenseBreakdown } from "../features/finances/components/ExpenseBreakdown";
import { BudgetPanel } from "../features/finances/components/BudgetPanel";

import "./FinancesPage.css";

function shiftMonth(
  month: string,
  offset: number
): string {
  const [year, monthNumber] =
    month.split("-").map(Number);

  return getMonthKey(
    new Date(
      year,
      monthNumber - 1 + offset,
      1
    )
  );
}

function formatMonthLabel(
  month: string
): string {
  const [year, monthNumber] =
    month.split("-").map(Number);

  return new Intl.DateTimeFormat("es-MX", {
    month: "long",
    year: "numeric",
  }).format(
    new Date(year, monthNumber - 1, 1)
  );
}

export function FinancesPage() {
  const transactions = useFinancesStore(
    (state) => state.transactions
  );

  const [month, setMonth] = useState(
    getMonthKey()
  );

  const monthlyTransactions = useMemo(
    () =>
      getMonthlyTransactions(
        transactions,
        month
      ),
    [transactions, month]
  );

  const summary = useMemo(
    () =>
      getFinanceSummary(
        monthlyTransactions
      ),
    [monthlyTransactions]
  );

  const breakdown = useMemo(
    () =>
      getExpenseBreakdown(
        monthlyTransactions
      ),
    [monthlyTransactions]
  );

  return (
    <div className="sf-finances-page">
      <header className="sf-finances-header">
        <div>
          <div className="sf-finances-heading">
            <Wallet
              size={25}
              color="#20b879"
            />

            <h2>Finanzas</h2>
          </div>

          <p className="sf-muted">
            Organiza tus ingresos, gastos y presupuestos.
          </p>
        </div>

        <div className="sf-finance-month-nav">
          <button
            onClick={() =>
              setMonth(
                shiftMonth(month, -1)
              )
            }
            title="Mes anterior"
          >
            <ChevronLeft size={18} />
          </button>

          <strong>
            {formatMonthLabel(month)}
          </strong>

          <button
            onClick={() =>
              setMonth(
                shiftMonth(month, 1)
              )
            }
            title="Mes siguiente"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </header>

      <FinanceOverview summary={summary} />

      <div className="sf-finances-main-grid">
        <TransactionList
          transactions={monthlyTransactions}
        />

        <TransactionForm />
      </div>

      <div className="sf-finances-bottom-grid">
        <ExpenseBreakdown
          data={breakdown}
        />

        <BudgetPanel
          month={month}
          transactions={monthlyTransactions}
        />
      </div>
    </div>
  );
}
