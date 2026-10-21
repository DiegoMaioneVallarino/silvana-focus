
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  XPReward,
  XPSource,
  AchievementId,
} from "./progression.types";

import {
  XP_REWARDS,
  MIN_FOCUS_SECONDS,
} from "./progression.config";

import { makeRewardId } from "./progression.utils";

import { useTasksStore } from "../tasks/tasks.store";
import { useHabitsStore } from "../habits/habits.store";
import { useProjectsStore } from "../projects/projects.store";
import { useGoalsStore } from "../goals/goals.store";
import { useActivityStore } from "../activity/activity.store";

import {
  getHabitStats,
} from "../habits/habits.utils";

import {
  isHabitScheduled,
  getHabitStartDate,
} from "../habits/habits.utils";

import { toLocalDateKey } from "../streaks/streaks.utils";

interface ProgressionState {
  rewards: XPReward[];

  // Fecha en la que se desbloqueó cada logro.
  achievements: Partial<
    Record<AchievementId, string>
  >;

  syncProgression: () => void;
}

interface RewardCandidate {
  source: XPSource;
  sourceId: string;
  awardedAt: string;
}

function collectRewards(): RewardCandidate[] {
  const candidates: RewardCandidate[] = [];

  const tasks = useTasksStore.getState().tasks;
  const habits = useHabitsStore.getState().habits;
  const projects = useProjectsStore.getState().projects;
  const goals = useGoalsStore.getState().goals;
  const sessions = useActivityStore.getState().sessions;

  for (const task of tasks) {
    if (
      task.status === "completed" &&
      task.completedAt
    ) {
      candidates.push({
        source: "task",
        sourceId: task.id,
        awardedAt: task.completedAt,
      });
    }
  }

  for (const habit of habits) {
    const startDate = getHabitStartDate(habit);
    const today = toLocalDateKey(new Date());
    const archiveDate = habit.archivedAt
      ? toLocalDateKey(new Date(habit.archivedAt))
      : null;

    for (const date of habit.completedDates) {
      if (
        date < startDate ||
        date > today ||
        (archiveDate && date > archiveDate) ||
        !isHabitScheduled(habit, date)
      ) {
        continue;
      }

      candidates.push({
        source: "habit",
        sourceId: `${habit.id}:${date}`,
        awardedAt: `${date}T12:00:00`,
      });
    }
  }

  for (const session of sessions) {
    if (
      session.durationSeconds >= MIN_FOCUS_SECONDS
    ) {
      candidates.push({
        source: "focus",
        sourceId: session.id,
        awardedAt: session.endedAt,
      });
    }
  }

  for (const goal of goals) {
    for (const stage of goal.stages) {
      if (
        stage.status === "completed" &&
        stage.completedAt
      ) {
        candidates.push({
          source: "goal_stage",
          sourceId: `${goal.id}:${stage.id}`,
          awardedAt: stage.completedAt,
        });
      }
    }
  }

  for (const project of projects) {
    if (
      project.status === "completed" &&
      project.completedAt
    ) {
      candidates.push({
        source: "project",
        sourceId: project.id,
        awardedAt: project.completedAt,
      });
    }
  }

  return candidates;
}

function collectUnlockedAchievements(): AchievementId[] {
  const unlocked: AchievementId[] = [];

  const tasks = useTasksStore.getState().tasks;
  const habits = useHabitsStore.getState().habits;
  const projects = useProjectsStore.getState().projects;
  const goals = useGoalsStore.getState().goals;
  const sessions = useActivityStore.getState().sessions;

  if (tasks.some((task) => task.status === "completed")) {
    unlocked.push("first_task");
  }

  if (
    habits.some(
      (habit) => getHabitStats(habit).longestStreak >= 7
    )
  ) {
    unlocked.push("habit_streak_7");
  }

  const focusSeconds = sessions.reduce(
    (total, session) =>
      total + session.durationSeconds,
    0
  );

  if (focusSeconds >= 10 * 60 * 60) {
    unlocked.push("focus_10_hours");
  }

  if (
    projects.some(
      (project) => project.status === "completed"
    )
  ) {
    unlocked.push("first_project");
  }

  const completedStages = goals.reduce(
    (total, goal) =>
      total +
      goal.stages.filter(
        (stage) => stage.status === "completed"
      ).length,
    0
  );

  if (completedStages >= 5) {
    unlocked.push("five_goal_stages");
  }

  return unlocked;
}

export const useProgressionStore =
  create<ProgressionState>()(
    persist(
      (set) => ({
        rewards: [],
        achievements: {},

        syncProgression: () => {
          const candidates = collectRewards();
          const activeIds = new Set(
            candidates.map((candidate) =>
              makeRewardId(
                candidate.source,
                candidate.sourceId
              )
            )
          );

          const unlocked = collectUnlockedAchievements();
          const now = new Date().toISOString();

          set((state) => {
            const existingIds = new Set(
              state.rewards.map((reward) => reward.id)
            );

            const updatedRewards = state.rewards.map(
              (reward) => ({
                ...reward,
                active: activeIds.has(reward.id),
              })
            );

            for (const candidate of candidates) {
              const id = makeRewardId(
                candidate.source,
                candidate.sourceId
              );

              if (existingIds.has(id)) {
                continue;
              }

              updatedRewards.push({
                id,
                source: candidate.source,
                sourceId: candidate.sourceId,
                amount: XP_REWARDS[candidate.source],
                awardedAt: candidate.awardedAt,
                active: true,
              });

              existingIds.add(id);
            }

            const achievements = {
              ...state.achievements,
            };

            for (const id of unlocked) {
              if (!achievements[id]) {
                achievements[id] = now;
              }
            }

            return {
              rewards: updatedRewards,
              achievements,
            };
          });
        },
      }),
      {
        name: "silvana-progression",
      }
    )
  );
