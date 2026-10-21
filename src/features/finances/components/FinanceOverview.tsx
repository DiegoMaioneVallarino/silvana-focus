
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  PiggyBank,
} from "lucide-react";

import type {
  FinanceSummary,
} from "../finances.types";

import { formatMoney } from "../finances.utils";

interface FinanceOverviewProps {
  summary: FinanceSummary;
}

export function FinanceOverview({
  summary,
}: FinanceOverviewProps) {
  const cards = [
    {
      title: "Ingresos",
      value: formatMoney(summary.income),
      icon: ArrowDownLeft,
      color: "#20b879",
    },
    {
      title: "Gastos",
      value: formatMoney(summary.expenses),
      icon: ArrowUpRight,
      color: "#ef6464",
    },
    {
      title: "Balance",
      value: formatMoney(summary.balance),
      icon: Wallet,
      color:
        summary.balance >= 0
          ? "#3d73ff"
          : "#ef6464",
    },
    {
      title: "Tasa de ahorro",
      value: `${summary.savingsRate}%`,
      icon: PiggyBank,
      color: "#873cff",
    },
  ];

  return (
    <div className="sf-finance-overview">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="sf-finance-stat sf-card"
          >
            <div className="sf-finance-stat-top">
              <span>{card.title}</span>

              <Icon
                size={19}
                color={card.color}
              />
            </div>

            <strong>{card.value}</strong>
          </div>
        );
      })}
    </div>
  );
}
