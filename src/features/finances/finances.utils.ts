
import type {
  Transaction,
  TransactionCategory,
  FinanceSummary,
  ExpenseCategoryData,
  Budget,
  BudgetProgress,
} from "./finances.types";

export const financeCategories: Record<
  TransactionCategory,
  {
    label: string;
    emoji: string;
    color: string;
  }
> = {
  salary: {
    label: "Salario",
    emoji: "💼",
    color: "#20b879",
  },
  business: {
    label: "Negocios",
    emoji: "🏢",
    color: "#3d73ff",
  },
  freelance: {
    label: "Freelance",
    emoji: "💻",
    color: "#873cff",
  },
  food: {
    label: "Alimentación",
    emoji: "🍔",
    color: "#ff5a12",
  },
  transport: {
    label: "Transporte",
    emoji: "🚗",
    color: "#3d73ff",
  },
  housing: {
    label: "Vivienda",
    emoji: "🏠",
    color: "#873cff",
  },
  services: {
    label: "Servicios",
    emoji: "💡",
    color: "#f5a623",
  },
  entertainment: {
    label: "Entretenimiento",
    emoji: "🎮",
    color: "#ec4899",
  },
  health: {
    label: "Salud",
    emoji: "💊",
    color: "#20b879",
  },
  education: {
    label: "Educación",
    emoji: "📚",
    color: "#6366f1",
  },
  shopping: {
    label: "Compras",
    emoji: "🛍️",
    color: "#d946ef",
  },
  other: {
    label: "Otros",
    emoji: "📦",
    color: "#94a3b8",
  },
};

export const incomeCategories: TransactionCategory[] = [
  "salary",
  "business",
  "freelance",
  "other",
];

export const expenseCategories: TransactionCategory[] = [
  "food",
  "transport",
  "housing",
  "services",
  "entertainment",
  "health",
  "education",
  "shopping",
  "other",
];

export function getMonthKey(
  date: Date = new Date()
): string {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  return `${year}-${month}`;
}

export function formatMoney(
  amount: number
): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getMonthlyTransactions(
  transactions: Transaction[],
  month: string
): Transaction[] {
  return transactions.filter(
    (transaction) =>
      transaction.date.slice(0, 7) === month
  );
}

export function getFinanceSummary(
  transactions: Transaction[]
): FinanceSummary {
  const income = transactions
    .filter(
      (transaction) =>
        transaction.type === "income"
    )
    .reduce(
      (sum, transaction) =>
        sum + transaction.amount,
      0
    );

  const expenses = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense"
    )
    .reduce(
      (sum, transaction) =>
        sum + transaction.amount,
      0
    );

  const balance = income - expenses;

  return {
    income,
    expenses,
    balance,
    transactionCount: transactions.length,
    savingsRate:
      income > 0
        ? Math.round(
            (balance / income) * 100
          )
        : 0,
  };
}

export function getExpenseBreakdown(
  transactions: Transaction[]
): ExpenseCategoryData[] {
  const expenses = transactions.filter(
    (transaction) =>
      transaction.type === "expense"
  );

  const total = expenses.reduce(
    (sum, transaction) =>
      sum + transaction.amount,
    0
  );

  const categories = new Map<
    TransactionCategory,
    number
  >();

  for (const transaction of expenses) {
    categories.set(
      transaction.category,
      (categories.get(transaction.category) ?? 0) +
        transaction.amount
    );
  }

  return [...categories.entries()]
    .map(([category, amount]) => ({
      category,
      amount,
      percentage:
        total > 0
          ? Math.round((amount / total) * 100)
          : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function getBudgetProgress(
  budget: Budget,
  transactions: Transaction[]
): BudgetProgress {
  const spent = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense" &&
        transaction.category === budget.category &&
        transaction.date.slice(0, 7) === budget.month
    )
    .reduce(
      (sum, transaction) =>
        sum + transaction.amount,
      0
    );

  return {
    budget,
    spent,
    remaining: budget.limit - spent,
    percentage:
      budget.limit > 0
        ? Math.round(
            (spent / budget.limit) * 100
          )
        : 0,
    exceeded: spent > budget.limit,
  };
}
