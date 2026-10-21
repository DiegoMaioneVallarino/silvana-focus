
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  Transaction,
  CreateTransactionInput,
  Budget,
  TransactionCategory,
} from "./finances.types";

interface FinancesState {
  transactions: Transaction[];
  budgets: Budget[];

  addTransaction: (
    input: CreateTransactionInput
  ) => string;

  updateTransaction: (
    id: string,
    changes: Partial<CreateTransactionInput>
  ) => void;

  deleteTransaction: (
    id: string
  ) => void;

  setBudget: (
    category: TransactionCategory,
    limit: number,
    month: string
  ) => void;

  deleteBudget: (
    id: string
  ) => void;
}

export const useFinancesStore =
  create<FinancesState>()(
    persist(
      (set) => ({
        transactions: [],
        budgets: [],

        addTransaction: (input) => {
          if (
            !Number.isFinite(input.amount) ||
            input.amount <= 0
          ) {
            return "";
          }

          const id = crypto.randomUUID();

          set((state) => ({
            transactions: [
              {
                ...input,
                id,
                createdAt:
                  new Date().toISOString(),
              },
              ...state.transactions,
            ],
          }));

          return id;
        },

        updateTransaction: (
          id,
          changes
        ) =>
          set((state) => ({
            transactions:
              state.transactions.map(
                (transaction) => {
                  if (
                    transaction.id !== id
                  ) {
                    return transaction;
                  }

                  const updated = {
                    ...transaction,
                    ...changes,
                  };

                  if (
                    !Number.isFinite(
                      updated.amount
                    ) ||
                    updated.amount <= 0
                  ) {
                    return transaction;
                  }

                  return updated;
                }
              ),
          })),

        deleteTransaction: (id) =>
          set((state) => ({
            transactions:
              state.transactions.filter(
                (transaction) =>
                  transaction.id !== id
              ),
          })),

        setBudget: (
          category,
          limit,
          month
        ) => {
          if (
            !Number.isFinite(limit) ||
            limit <= 0
          ) {
            return;
          }

          set((state) => {
            const existing =
              state.budgets.find(
                (budget) =>
                  budget.category === category &&
                  budget.month === month
              );

            if (existing) {
              return {
                budgets: state.budgets.map(
                  (budget) =>
                    budget.id === existing.id
                      ? {
                          ...budget,
                          limit,
                        }
                      : budget
                ),
              };
            }

            return {
              budgets: [
                ...state.budgets,
                {
                  id: crypto.randomUUID(),
                  category,
                  limit,
                  month,
                  createdAt:
                    new Date().toISOString(),
                },
              ],
            };
          });
        },

        deleteBudget: (id) =>
          set((state) => ({
            budgets: state.budgets.filter(
              (budget) =>
                budget.id !== id
            ),
          })),
      }),
      {
        name: "silvana-finances",
      }
    )
  );
