
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  ActivitySession,
  ActiveTimer,
  ActivityCategory,
} from "./activity.types";

interface ActivityState {
  sessions: ActivitySession[];
  activeTimer: ActiveTimer | null;

  startTimer: (
    title: string,
    goalId: string | null,
    category: ActivityCategory
  ) => void;

  pauseTimer: () => void;
  resumeTimer: () => void;
  finishTimer: () => ActivitySession | null;
  discardTimer: () => void;
  addSession: (session: ActivitySession) => void;
  removeSession: (id: string) => void;
}

export function getElapsedSeconds(
  timer: ActiveTimer | null,
  now = Date.now()
): number {
  if (!timer) return 0;

  const runningSeconds = timer.resumedAt
    ? Math.max(
        0,
        Math.floor(
          (now - new Date(timer.resumedAt).getTime()) / 1000
        )
      )
    : 0;

  return timer.accumulatedSeconds + runningSeconds;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeTimer: null,

      startTimer: (title, goalId, category) => {
        if (get().activeTimer) return;

        const now = new Date().toISOString();

        set({
          activeTimer: {
            title,
            goalId,
            category,
            startedAt: now,
            accumulatedSeconds: 0,
            resumedAt: now,
          },
        });
      },

      pauseTimer: () => {
        const timer = get().activeTimer;
        if (!timer || !timer.resumedAt) return;

        set({
          activeTimer: {
            ...timer,
            accumulatedSeconds: getElapsedSeconds(timer),
            resumedAt: null,
          },
        });
      },

      resumeTimer: () => {
        const timer = get().activeTimer;
        if (!timer || timer.resumedAt) return;

        set({
          activeTimer: {
            ...timer,
            resumedAt: new Date().toISOString(),
          },
        });
      },

      finishTimer: () => {
        const timer = get().activeTimer;
        if (!timer) return null;

        const durationSeconds = getElapsedSeconds(timer);

        if (durationSeconds < 1) {
          set({ activeTimer: null });
          return null;
        }

        const session: ActivitySession = {
          id: crypto.randomUUID(),
          goalId: timer.goalId,
          title: timer.title,
          category: timer.category,
          startedAt: timer.startedAt,
          endedAt: new Date().toISOString(),
          durationSeconds,
          source: "timer",
        };

        set((state) => ({
          sessions: [...state.sessions, session],
          activeTimer: null,
        }));

        return session;
      },

      discardTimer: () => {
        set({ activeTimer: null });
      },

      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, session],
        })),

      removeSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter(
            (session) => session.id !== id
          ),
        })),
    }),
    {
      name: "silvana-activities",
    }
  )
);
