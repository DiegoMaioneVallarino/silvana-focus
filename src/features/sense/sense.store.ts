
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  SenseConstraints,
  SenseEvent,
  SenseEventType,
  SensePauseReason,
  SenseSession,
  SenseSessionReport,
} from "./sense.types";

import {
  createSenseEvent,
  transitionSession,
} from "./sense.engine";

interface StartSessionInput {
  blockId: string;
  title: string;
  constraints: SenseConstraints;
}

interface SenseState {
  sessions: SenseSession[];
  events: SenseEvent[];
  reports: SenseSessionReport[];
  activeSessionId: string | null;

  startSession: (
    input: StartSessionInput
  ) => boolean;

  pauseSession: (
    reason?: SensePauseReason
  ) => boolean;

  resumeSession: () => boolean;

  finishSession: (
    outcome: SenseSessionReport["outcome"],
    difficulty?: number | null,
    notes?: string
  ) => boolean;

  abandonSession: () => boolean;
}

export const useSenseStore =
  create<SenseState>()(
    persist(
      (set, get) => ({
        sessions: [],
        events: [],
        reports: [],
        activeSessionId: null,

        startSession: (input) => {
          const state = get();

          if (state.activeSessionId) {
            return false;
          }

          if (
            !input.blockId ||
            !input.title.trim()
          ) {
            return false;
          }

          const now =
            new Date().toISOString();

          const id = crypto.randomUUID();

          const session: SenseSession = {
            id,
            blockId: input.blockId,
            title: input.title.trim(),
            status: "active",
            startedAt: now,
            endedAt: null,
            activeSince: now,
            effectiveMinutes: 0,
            constraints: input.constraints,
            lastPauseReason: null,
          };

          set((current) => ({
            sessions: [
              ...current.sessions,
              session,
            ],
            activeSessionId: id,
            events: [
              ...current.events,
              createSenseEvent(
                id,
                "started",
                now
              ),
            ],
          }));

          return true;
        },

        pauseSession: (
          reason = "unspecified"
        ) =>
          applyTransition(
            get,
            set,
            "paused",
            reason
          ),

        resumeSession: () =>
          applyTransition(
            get,
            set,
            "resumed"
          ),

        finishSession: (
          outcome,
          difficulty = null,
          notes = ""
        ) => {
          const id = get().activeSessionId;

          if (!id) return false;

          const success = applyTransition(
            get,
            set,
            "completed"
          );

          if (!success) return false;

          set((state) => ({
            reports: [
              ...state.reports,
              {
                sessionId: id,
                outcome,
                difficulty:
                  difficulty === null
                    ? null
                    : Math.max(
                        0,
                        Math.min(5, difficulty)
                      ),
                notes,
                reportedAt:
                  new Date().toISOString(),
              },
            ],
          }));

          return true;
        },

        abandonSession: () =>
          applyTransition(
            get,
            set,
            "abandoned"
          ),
      }),
      {
        name: "silvana-sense",
      }
    )
  );

type StateGetter = () => SenseState;

type StateSetter = (
  updater: (state: SenseState) => Partial<SenseState>
) => void;

function applyTransition(
  get: StateGetter,
  set: StateSetter,
  type: SenseEventType,
  reason?: SensePauseReason
): boolean {
  const state = get();
  const id = state.activeSessionId;

  if (!id) return false;

  const session = state.sessions.find(
    (item) => item.id === id
  );

  if (!session) return false;

  const now = new Date().toISOString();

  const updated = transitionSession(
    session,
    type,
    now,
    reason
  );

  if (!updated) return false;

  set((current) => ({
    sessions: current.sessions.map(
      (item) => item.id === id ? updated : item
    ),

    activeSessionId:
      updated.status === "completed" ||
      updated.status === "abandoned"
        ? null
        : id,

    events: [
      ...current.events,
      createSenseEvent(
        id,
        type,
        now,
        reason
      ),
    ],
  }));

  return true;
}
