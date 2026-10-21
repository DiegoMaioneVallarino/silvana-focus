
import { Link } from "react-router-dom";
import { Wallet, ArrowUpRight, PiggyBank } from "lucide-react";

import { useFinancesStore } from "../../finances/finances.store";
import { useFinancialGoalsStore } from "../../finances/financial-goals.store";

import {
  formatMoney,
  getMonthKey,
  getMonthlyTransactions,
  getFinanceSummary,
} from "../../finances/finances.utils";

import { getFinancialGoalSummary } from "../../finances/financial-goals.utils";

export function DashboardFinanceCard() {
  const transactions = useFinancesStore(
    (s) => s.transactions
  );

  const goals = useFinancialGoalsStore(
    (s) => s.goals
  );

  const month = getMonthKey();

  const summary = getFinanceSummary(
    getMonthlyTransactions(transactions, month)
  );

  const activeGoals = goals.filter(
    (goal) => !goal.archivedAt
  );

  const saved = activeGoals.reduce(
    (sum, goal) =>
      sum + getFinancialGoalSummary(goal).saved,
    0
  );

  return (
    <section className="sf-card sf-dashboard-widget">
      <div className="sf-dashboard-widget-header">
        <div className="sf-dashboard-widget-title">
          <Wallet size={19} color="#20b879" />
          <h3>Finanzas</h3>
        </div>

        <Link to="/finances">
          <ArrowUpRight size={17} />
        </Link>
      </div>

      <span className="sf-dashboard-widget-label">
        Balance de este mes
      </span>

      <strong
        className="sf-dashboard-widget-value"
        style={{
          color: summary.balance >= 0
            ? "#20b879"
            : "#ef6464",
        }}
      >
        {formatMoney(summary.balance)}
      </strong>

      <div className="sf-dashboard-finance-stats">
        <div>
          <span>Ingresos</span>
          <strong>{formatMoney(summary.income)}</strong>
        </div>
        <div>
          <span>Gastos</span>
          <strong>{formatMoney(summary.expenses)}</strong>
        </div>
      </div>

      <div className="sf-dashboard-widget-footer">
        <PiggyBank size={15} color="#873cff" />
        <span>
          {formatMoney(saved)} en metas de ahorro
        </span>
      </div>
    </section>
  );
}
