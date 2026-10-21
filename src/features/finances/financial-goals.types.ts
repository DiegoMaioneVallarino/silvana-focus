
export interface SavingsContribution {
  id: string;
  amount: number;
  date: string;
  note: string;
  createdAt: string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  initialAmount: number;
  targetDate: string | null;
  goalId: string | null;
  color: string;
  contributions: SavingsContribution[];
  createdAt: string;
  archivedAt: string | null;
}

export type CreateFinancialGoalInput = Pick<
  FinancialGoal,
  | "title"
  | "description"
  | "targetAmount"
  | "initialAmount"
  | "targetDate"
  | "goalId"
  | "color"
>;

export interface FinancialGoalSummary {
  saved: number;
  remaining: number;
  percentage: number;
  monthlyRequired: number | null;
  monthsRemaining: number | null;
  completed: boolean;
}
