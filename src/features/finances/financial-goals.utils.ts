
import type {
  FinancialGoal,
  FinancialGoalSummary,
} from "./financial-goals.types";

import { toLocalDateKey } from "../streaks/streaks.utils";

export function getFinancialGoalSummary(
  goal: FinancialGoal,
  today = toLocalDateKey(new Date())
): FinancialGoalSummary {
  const contributed = goal.contributions.reduce(
    (sum, contribution) => sum + contribution.amount,
    0
  );

  const saved = goal.initialAmount + contributed;

  const remaining = Math.max(
    0,
    goal.targetAmount - saved
  );

  const percentage =
    goal.targetAmount > 0
      ? Math.min(
          100,
          Math.round(
            (saved / goal.targetAmount) * 100
          )
        )
      : 0;

  let monthsRemaining: number | null = null;
  let monthlyRequired: number | null = null;

  if (goal.targetDate) {
    const [targetYear, targetMonth] =
      goal.targetDate.split("-").map(Number);

    const [currentYear, currentMonth] =
      today.split("-").map(Number);

    const monthDifference =
      (targetYear - currentYear) * 12 +
      (targetMonth - currentMonth);

    monthsRemaining = Math.max(
      0,
      monthDifference
    );

    monthlyRequired =
      remaining === 0
        ? 0
        : monthsRemaining > 0
          ? Math.ceil(
              (remaining / monthsRemaining) * 100
            ) / 100
          : null;
  }

  return {
    saved,
    remaining,
    percentage,
    monthlyRequired,
    monthsRemaining,
    completed: remaining === 0,
  };
}
