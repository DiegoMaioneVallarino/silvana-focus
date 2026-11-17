
import { create } from "zustand";
import {
  persist,
  createJSONStorage,
} from "zustand/middleware";

import type {
  SenseActivity,
  SenseConstraints,
  SenseEvent,
  SenseEventType,
  SensePauseReason,
  SenseRecovery,
  SenseSession,
  SenseSessionReport,
} from "./sense.types";

import {
  createSenseEvent,
  transitionSession,
} from "./sense.engine";

import {
  suspendUnconfirmedSession,
} from "./sense.recovery";

import {
  createSenseConstraints,
} from "./sense.constraints";

interface StartSessionInput {
  blockId: string;
  title: string;
  constraints: SenseConstraints;
}

interface SenseState {
  activities: SenseActivity[];
  sessions: SenseSession[];
  events: SenseEvent[];
  reports: SenseSessionReport[];
  activeSessionId: string | null;
  recovery: SenseRecovery | null;
  lastSeenAt: string | null;

  startSession: (
    input: StartSessionInput
  ) => boolean;

  startActivity: (
    activityId: string
  ) => boolean;

  startSpontaneous: (
    title: string,
    targetMinutes?: number | null
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

  heartbeat: () => void;
  recoverSession: (
    resume: boolean
  ) => void;
  checkRecovery: () => void;
}

const nowISO = () => new Date().toISOString();



export const useSenseStore =
  create<SenseState>()(
    persist(
      (set, get) => {
        function begin(
          activity: SenseActivity
        ): boolean {
          if (get().activeSessionId) {
            return false;
          }

          const now = nowISO();
          const id = crypto.randomUUID();

          const session: SenseSession = {
            id,
            activityId: activity.id,
            blockId: activity.blockId ?? "",
            title: activity.title,
            status: "active",
            startedAt: now,
            endedAt: null,
            activeSince: now,
            effectiveMinutes: 0,
            constraints: activity.constraints,
            lastPauseReason: null,
          };

          set((state) => ({
            sessions: [...state.sessions, session],
            activeSessionId: id,
            recovery: null,
            lastSeenAt: now,
            events: [
              ...state.events,
              createSenseEvent(id, "started", now),
            ],
          }));

          return true;
        }

        function transition(
          type: SenseEventType,
          reason?: SensePauseReason
        ): boolean {
          const state = get();

          if (state.recovery) return false;

          const id = state.activeSessionId;
          if (!id) return false;

          const session = state.sessions.find(
            (item) => item.id === id
          );
          if (!session) return false;

          const now = nowISO();
          const updated = transitionSession(
            session,
            type,
            now,
            reason
          );
          if (!updated) return false;

          const closed =
            updated.status === "completed" ||
            updated.status === "abandoned";

          set((current) => ({
            sessions: current.sessions.map(
              (item) =>
                item.id === id ? updated : item
            ),
            activeSessionId: closed ? null : id,
            lastSeenAt: now,
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

        return {
          activities: [],
          sessions: [],
          events: [],
          reports: [],
          activeSessionId: null,
          recovery: null,
          lastSeenAt: null,

          startSession: (input) => {
            if (
              get().activeSessionId ||
              !input.blockId ||
              !input.title.trim()
            ) {
              return false;
            }

            let activity = get().activities.find(
              (item) =>
                item.blockId === input.blockId
            );

            if (!activity) {
              activity = {
                id: crypto.randomUUID(),
                blockId: input.blockId,
                title: input.title.trim(),
                origin: "planner",
                constraints: input.constraints,
                createdAt: nowISO(),
              };

              const created = activity;
              set((state) => ({
                activities: [
                  ...state.activities,
                  created,
                ],
              }));
            }

            return begin(activity);
          },

          startActivity: (activityId) => {
            const activity = get().activities.find(
              (item) => item.id === activityId
            );

            return activity
              ? begin(activity)
              : false;
          },

          startSpontaneous: (
            title,
            targetMinutes = null
          ) => {
            if (
              get().activeSessionId ||
              !title.trim()
            ) {
              return false;
            }

            const activity: SenseActivity = {
              id: crypto.randomUUID(),
              blockId: null,
              title: title.trim(),
              origin: "spontaneous",
              createdAt: nowISO(),
              constraints: createSenseConstraints(
                "opportunistic",
                { targetEffectiveMinutes: targetMinutes }
              ),
            };

            set((state) => ({
              activities: [
                ...state.activities,
                activity,
              ],
            }));

            return begin(activity);
          },

          pauseSession: (
            reason = "unspecified"
          ) => transition("paused", reason),

          resumeSession: () =>
            transition("resumed"),

          finishSession: (
            outcome,
            difficulty = null,
            notes = ""
          ) => {
            const id = get().activeSessionId;
            if (!id) return false;

            if (!transition("completed")) {
              return false;
            }

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
                  reportedAt: nowISO(),
                },
              ],
            }));

            return true;
          },

          abandonSession: () =>
            transition("abandoned"),

          heartbeat: () => {
            const state = get();
            if (
              !state.activeSessionId ||
              state.recovery
            ) {
              return;
            }

            const session = state.sessions.find(
              (item) =>
                item.id === state.activeSessionId
            );

            if (session?.status === "active") {
              set({ lastSeenAt: nowISO() });
            }
          },

          checkRecovery: () => {
            const state = get();
            if (
              !state.activeSessionId ||
              state.recovery
            ) {
              return;
            }

            const session = state.sessions.find(
              (item) =>
                item.id === state.activeSessionId
            );

            if (session?.status !== "active") {
              return;
            }

            const confirmedAt =
              state.lastSeenAt ??
              session.activeSince ??
              session.startedAt;

            const detectedAt = nowISO();

            set((current) => ({
              sessions: current.sessions.map(
                (item) =>
                  item.id === session.id
                    ? suspendUnconfirmedSession(
                        item,
                        confirmedAt
                      )
                    : item
              ),
              recovery: {
                sessionId: session.id,
                lastConfirmedAt: confirmedAt,
                detectedAt,
              },
            }));
          },

          recoverSession: (resume) => {
            const state = get();
            if (!state.recovery) return;

            const id = state.recovery.sessionId;
            const now = nowISO();

            const session = state.sessions.find(
              (item) => item.id === id
            );

            if (!session) {
              set({
                recovery: null,
                activeSessionId: null,
              });
              return;
            }

            const updated = resume
              ? transitionSession(
                  session,
                  "resumed",
                  now
                )
              : session;

            set((current) => ({
              sessions: current.sessions.map(
                (item) =>
                  item.id === id && updated
                    ? updated
                    : item
              ),
              recovery: null,
              lastSeenAt: now,
              events:
                resume && updated
                  ? [
                      ...current.events,
                      createSenseEvent(
                        id,
                        "resumed",
                        now
                      ),
                    ]
                  : current.events,
            }));
          },
        };
      },
      {
        name: "silvana-sense",
        version: 2,
          storage: createJSONStorage(() => localStorage),

        migrate: (persisted: unknown) => {
          const old = persisted as Partial<SenseState>;

          const activities: SenseActivity[] = [
            ...(old.activities ?? []),
          ];

          const sessions = (
            old.sessions ?? []
          ).map((session) => {
            if (session.activityId) {
              return session;
            }

            let activity = activities.find(
              (item) =>
                item.blockId === session.blockId
            );

            if (!activity) {
              activity = {
                id: crypto.randomUUID(),
                title: session.title,
                blockId: session.blockId,
                origin: "planner",
                constraints: session.constraints,
                createdAt: session.startedAt,
              };
              activities.push(activity);
            }

            return {
              ...session,
              activityId: activity.id,
            };
          });

          return {
            ...old,
            activities,
            sessions,
            recovery: null,
            lastSeenAt:
              old.lastSeenAt ?? null,
          };
        },
      }
    )
  );
