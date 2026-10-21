
import type {
  XPReward,
  XPSource,
  LevelInfo,
} from "./progression.types";

import {
  getLevelThreshold,
  getLevelTitle,
} from "./progression.config";

import { toLocalDateKey } from "../streaks/streaks.utils";

export function makeRewardId(
  source: XPSource,
  sourceId: string
): string {
  return `${source}:${sourceId}`;
}

export function getActiveXP(
  rewards: XPReward[]
): number {
  return rewards.reduce(
    (total, reward) =>
      total + (reward.active ? reward.amount : 0),
    0
  );
}

export function getLifetimeXP(
  rewards: XPReward[]
): number {
  return rewards.reduce(
    (total, reward) => total + reward.amount,
    0
  );
}

export function getTodayXP(
  rewards: XPReward[],
  today = toLocalDateKey(new Date())
): number {
  return rewards.reduce((total, reward) => {
    if (!reward.active) return total;

    const rewardDate = toLocalDateKey(
      new Date(reward.awardedAt)
    );

    return rewardDate === today
      ? total + reward.amount
      : total;
  }, 0);
}

export function calculateLevel(
  totalXP: number
): LevelInfo {
  const xp = Math.max(0, totalXP);

  let level = 1;

  while (
    level < 10000 &&
    xp >= getLevelThreshold(level + 1)
  ) {
    level++;
  }

  const currentLevelXP = getLevelThreshold(level);
  const nextLevelXP = getLevelThreshold(level + 1);

  const requiredXP =
    nextLevelXP - currentLevelXP;

  const progressXP =
    xp - currentLevelXP;

  return {
    level,
    title: getLevelTitle(level),
    totalXP: xp,
    currentLevelXP,
    nextLevelXP,
    progressXP,
    requiredXP,
    progressPercent:
      requiredXP > 0
        ? Math.min(
            100,
            Math.round(
              (progressXP / requiredXP) * 100
            )
          )
        : 100,
  };
}
