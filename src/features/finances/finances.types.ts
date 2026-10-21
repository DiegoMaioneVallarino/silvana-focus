
export type TransactionType =
  | "income"
  | "expense";

export type TransactionCategory =
  | "salary"
  | "business"
  | "freelance"
  | "food"
  | "transport"
  | "housing"
  | "services"
  | "entertainment"
  | "health"
  | "education"
  | "shopping"
  | "other";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  notes: string;
  createdAt: string;
}

export type CreateTransactionInput = Pick<
  Transaction,
  | "title"
  | "amount"
  | "type"
  | "category"
  | "date"
  | "notes"
>;

export interface Budget {
  id: string;
  category: TransactionCategory;
  limit: number;
  month: string;
  createdAt: string;
}

export interface FinanceSummary {
  income: number;
  expenses: number;
  balance: number;
  transactionCount: number;
  savingsRate: number;
}

export interface ExpenseCategoryData {
  category: TransactionCategory;
  amount: number;
  percentage: number;
}

export interface BudgetProgress {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  exceeded: boolean;
}
