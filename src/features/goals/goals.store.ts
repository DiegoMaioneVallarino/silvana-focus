
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  Goal,
  CreateGoalInput,
} from "./goals.types";

interface GoalsState {
  goals: Goal[];
  activeGoalId: string | null;

  createGoal: (input: CreateGoalInput) => string;
  selectGoal: (id: string) => void;

  addStage: (
    goalId: string,
    title: string,
    description: string
  ) => void;

  completeStage: (
    goalId: string,
    stageId: string
  ) => void;
}

const initialGoal: Goal = {
  id: "math-goal",
  title: "Aprender matemáticas",
  description: "Dominar los fundamentos matemáticos.",
  createdAt: new Date().toISOString(),
  durationMonths: 12,
  stages: [
    {
      id: "stage-1",
      title: "Fundamentos",
      description: "Bases y conceptos clave",
      status: "completed",
    },
    {
      id: "stage-2",
      title: "Álgebra esencial",
      description: "Ecuaciones y funciones",
      status: "completed",
    },
    {
      id: "stage-3",
      title: "Geometría",
      description: "Figuras y trigonometría",
      status: "available",
    },
    {
      id: "stage-4",
      title: "Precálculo",
      description: "Funciones avanzadas",
      status: "locked",
    },
    {
      id: "stage-5",
      title: "Cálculo",
      description: "Derivadas e integrales",
      status: "locked",
    },
  ],
};

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set) => ({
      goals: [initialGoal],
      activeGoalId: initialGoal.id,

      createGoal: (input) => {
        const id = crypto.randomUUID();

        const goal: Goal = {
          id,
          ...input,
          createdAt: new Date().toISOString(),
          stages: [],
        };

        set((state) => ({
          goals: [...state.goals, goal],
          activeGoalId: id,
        }));

        return id;
      },

      selectGoal: (id) =>
        set((state) => ({
          activeGoalId: state.goals.some(
            (goal) => goal.id === id
          )
            ? id
            : state.activeGoalId,
        })),

      addStage: (goalId, title, description) =>
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id !== goalId) return goal;

            return {
              ...goal,
              stages: [
                ...goal.stages,
                {
                  id: crypto.randomUUID(),
                  title,
                  description,
                  status:
                    goal.stages.length === 0
                      ? "available"
                      : "locked",
                },
              ],
            };
          }),
        })),

      completeStage: (goalId, stageId) =>
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id !== goalId) return goal;

            const index = goal.stages.findIndex(
              (stage) => stage.id === stageId
            );

            if (
              index === -1 ||
              goal.stages[index].status !== "available"
            ) {
              return goal;
            }

            return {
              ...goal,
              stages: goal.stages.map((stage, i) => {
                if (i === index) {
                  return {
                    ...stage,
                    status: "completed",
                    completedAt: new Date().toISOString(),
                  };
                }

                if (
                  i === index + 1 &&
                  stage.status === "locked"
                ) {
                  return {
                    ...stage,
                    status: "available",
                  };
                }

                return stage;
              }),
            };
          }),
        })),
    }),
    {
      name: "silvana-goals",
    }
  )
);
