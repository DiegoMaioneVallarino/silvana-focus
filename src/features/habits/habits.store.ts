
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  Habit,
  CreateHabitInput,
  UpdateHabitInput,
} from "./habits.types";

import { toLocalDateKey } from "../streaks/streaks.utils";

interface HabitsState {
  habits: Habit[];

  addHabit: (input: CreateHabitInput) => string;

  updateHabit: (
    id: string,
    changes: UpdateHabitInput
  ) => void;

  toggleHabitDate: (
    id: string,
    date: string
  ) => void;

  archiveHabit: (id: string) => void;
  restoreHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
}

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set) => ({
      habits: [],

      addHabit: (input) => {
        const id = crypto.randomUUID();

        set((state) => ({
          habits: [
            ...state.habits,
            {
              ...input,
              id,
              completedDates: [],
              createdAt: new Date().toISOString(),
              archivedAt: null,
            },
          ],
        }));

        return id;
      },

      updateHabit: (id, changes) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id
              ? { ...habit, ...changes }
              : habit
          ),
        })),

      toggleHabitDate: (id, date) =>
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== id || habit.archivedAt) {
              return habit;
            }

            const today = toLocalDateKey(new Date());
            const createdDate = toLocalDateKey(
              new Date(habit.createdAt)
            );

            const day = new Date(`${date}T12:00:00`);
            const scheduled =
              habit.frequency === "daily" ||
              habit.daysOfWeek.includes(day.getDay());

            if (
              !Number.isFinite(day.getTime()) ||
              date < createdDate ||
              date > today ||
              !scheduled
            ) {
              return habit;
            }

            const exists = habit.completedDates.includes(date);

            return {
              ...habit,
              completedDates: exists
                ? habit.completedDates.filter(
                    (item) => item !== date
                  )
                : [...habit.completedDates, date].sort(),
            };
          }),
        })),

      archiveHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id
              ? {
                  ...habit,
                  archivedAt: new Date().toISOString(),
                }
              : habit
          ),
        })),

      restoreHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id
              ? { ...habit, archivedAt: null }
              : habit
          ),
        })),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter(
            (habit) => habit.id !== id
          ),
        })),
    }),
    {
      name: "silvana-habits",
    }
  )
);
