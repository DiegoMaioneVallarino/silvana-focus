
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PlannerDayPreferences {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export interface PlannerPreferences {
  days: Record<number, PlannerDayPreferences>;
  breakMinutes: number;
  taskDurationMinutes: number;
  habitDurationMinutes: number;
  academyDurationMinutes: number;
  maxDailyMinutes: number;
}

interface PlannerPreferencesState
  extends PlannerPreferences {
  updateDay: (
    weekday: number,
    changes: Partial<PlannerDayPreferences>
  ) => void;

  updatePreferences: (
    changes: Partial<
      Omit<PlannerPreferences, "days">
    >
  ) => void;

  resetPreferences: () => void;
}

const createDefaultPreferences =
  (): PlannerPreferences => ({
    days: {
      0: {
        enabled: false,
        startTime: "09:00",
        endTime: "18:00",
      },
      1: {
        enabled: true,
        startTime: "08:00",
        endTime: "20:00",
      },
      2: {
        enabled: true,
        startTime: "08:00",
        endTime: "20:00",
      },
      3: {
        enabled: true,
        startTime: "08:00",
        endTime: "20:00",
      },
      4: {
        enabled: true,
        startTime: "08:00",
        endTime: "20:00",
      },
      5: {
        enabled: true,
        startTime: "08:00",
        endTime: "20:00",
      },
      6: {
        enabled: false,
        startTime: "09:00",
        endTime: "18:00",
      },
    },
    breakMinutes: 10,
    taskDurationMinutes: 45,
    habitDurationMinutes: 30,
    academyDurationMinutes: 45,
    maxDailyMinutes: 360,
  });

export const usePlannerPreferencesStore =
  create<PlannerPreferencesState>()(
    persist(
      (set) => ({
        ...createDefaultPreferences(),

        updateDay: (weekday, changes) => {
          if (
            !Number.isInteger(weekday) ||
            weekday < 0 ||
            weekday > 6
          ) {
            return;
          }

          set((state) => ({
            days: {
              ...state.days,
              [weekday]: {
                ...state.days[weekday],
                ...changes,
              },
            },
          }));
        },

        updatePreferences: (changes) =>
          set(changes),

        resetPreferences: () =>
          set(createDefaultPreferences()),
      }),
      {
        name: "silvana-planner-preferences",
      }
    )
  );
