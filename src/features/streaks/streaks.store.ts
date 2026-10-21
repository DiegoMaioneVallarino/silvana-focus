
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  ActivityRecord,
  StreakSettings,
} from "./streaks.types";

import { toLocalDateKey } from "./streaks.utils";

interface StreakState {
  records: ActivityRecord[];
  settings: StreakSettings;

  logActivity: (goalId: string) => void;
  removeActivity: (goalId: string, date: string) => void;
  setRestDays: (days: number[]) => void;
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set) => ({
      records: [],
      settings: {
        restDays: [],
      },

      logActivity: (goalId) => {
        const now = new Date();
        const date = toLocalDateKey(now);

        set((state) => {
          const exists = state.records.some(
            (record) =>
              record.goalId === goalId &&
              record.date === date
          );

          if (exists) return state;

          return {
            records: [
              ...state.records,
              {
                id: crypto.randomUUID(),
                goalId,
                date,
                createdAt: now.toISOString(),
              },
            ],
          };
        });
      },

      removeActivity: (goalId, date) =>
        set((state) => ({
          records: state.records.filter(
            (record) =>
              !(
                record.goalId === goalId &&
                record.date === date
              )
          ),
        })),

      setRestDays: (days) =>
        set((state) => ({
          settings: {
            ...state.settings,
            restDays: [...new Set(days)].filter(
              (day) =>
                Number.isInteger(day) &&
                day >= 0 &&
                day <= 6
            ),
          },
        })),
    }),
    {
      name: "silvana-streaks",
    }
  )
);
