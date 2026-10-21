
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  FinancialGoal,
  CreateFinancialGoalInput,
} from "./financial-goals.types";

interface FinancialGoalsState {
  goals: FinancialGoal[];

  addGoal: (
    input: CreateFinancialGoalInput
  ) => string;

  updateGoal: (
    id: string,
    changes: Partial<CreateFinancialGoalInput>
  ) => void;

  deleteGoal: (id: string) => void;

  addContribution: (
    goalId: string,
    amount: number,
    date: string,
    note: string
  ) => void;

  removeContribution: (
    goalId: string,
    contributionId: string
  ) => void;

  archiveGoal: (id: string) => void;
  restoreGoal: (id: string) => void;
}

export const useFinancialGoalsStore =
  create<FinancialGoalsState>()(
    persist(
      (set) => ({
        goals: [],

        addGoal: (input) => {
          if (
            !input.title.trim() ||
            !Number.isFinite(input.targetAmount) ||
            input.targetAmount <= 0 ||
            !Number.isFinite(input.initialAmount) ||
            input.initialAmount < 0
          ) {
            return "";
          }

          const id = crypto.randomUUID();

          set((state) => ({
            goals: [
              {
                ...input,
                id,
                contributions: [],
                createdAt:
                  new Date().toISOString(),
                archivedAt: null,
              },
              ...state.goals,
            ],
          }));

          return id;
        },

        updateGoal: (id, changes) =>
          set((state) => ({
            goals: state.goals.map((goal) => {
              if (goal.id !== id) return goal;

              const updated = {
                ...goal,
                ...changes,
              };

              if (
                !updated.title.trim() ||
                !Number.isFinite(
                  updated.targetAmount
                ) ||
                updated.targetAmount <= 0 ||
                !Number.isFinite(
                  updated.initialAmount
                ) ||
                updated.initialAmount < 0
              ) {
                return goal;
              }

              return updated;
            }),
          })),

        deleteGoal: (id) =>
          set((state) => ({
            goals: state.goals.filter(
              (goal) => goal.id !== id
            ),
          })),

        addContribution: (
          goalId,
          amount,
          date,
          note
        ) => {
          if (
            !Number.isFinite(amount) ||
            amount <= 0 ||
            !/^\d{4}-\d{2}-\d{2}$/.test(date)
          ) {
            return;
          }

          set((state) => ({
            goals: state.goals.map((goal) =>
              goal.id === goalId &&
              !goal.archivedAt
                ? {
                    ...goal,
                    contributions: [
                      ...goal.contributions,
                      {
                        id: crypto.randomUUID(),
                        amount,
                        date,
                        note,
                        createdAt:
                          new Date().toISOString(),
                      },
                    ],
                  }
                : goal
            ),
          }));
        },

        removeContribution: (
          goalId,
          contributionId
        ) =>
          set((state) => ({
            goals: state.goals.map((goal) =>
              goal.id === goalId
                ? {
                    ...goal,
                    contributions:
                      goal.contributions.filter(
                        (contribution) =>
                          contribution.id !==
                          contributionId
                      ),
                  }
                : goal
            ),
          })),

        archiveGoal: (id) =>
          set((state) => ({
            goals: state.goals.map((goal) =>
              goal.id === id
                ? {
                    ...goal,
                    archivedAt:
                      new Date().toISOString(),
                  }
                : goal
            ),
          })),

        restoreGoal: (id) =>
          set((state) => ({
            goals: state.goals.map((goal) =>
              goal.id === id
                ? {
                    ...goal,
                    archivedAt: null,
                  }
                : goal
            ),
          })),
      }),
      {
        name: "silvana-financial-goals",
      }
    )
  );

