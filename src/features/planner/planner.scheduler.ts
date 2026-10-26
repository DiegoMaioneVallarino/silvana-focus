
import type {
  PlannerBlock,
} from "./planner.types";

import {
  getPlannerAvailability,
} from "./planner.availability";

import {
  rankPlannerCandidates,
} from "./planner.priorities";

import type {
  PlannerCandidate,
  RankedPlannerCandidate,
} from "./planner.priorities";

import {
  minutesToTime,
} from "./planner.utils";

export interface PlannerSchedulerOptions {
  date: string;
  dayStart: string;
  dayEnd: string;
  minimumBreakMinutes?: number;
  maxDailyMinutes?: number;
}

export interface ScheduledSuggestion {
  candidate: RankedPlannerCandidate;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export interface PlannerScheduleResult {
  scheduled: ScheduledSuggestion[];
  unscheduled: RankedPlannerCandidate[];
  totalScheduledMinutes: number;
  remainingMinutes: number;
}

export function generatePlannerSchedule(
  blocks: PlannerBlock[],
  candidates: PlannerCandidate[],
  options: PlannerSchedulerOptions
): PlannerScheduleResult {
  const {
    date,
    dayStart,
    dayEnd,
    minimumBreakMinutes = 10,
    maxDailyMinutes = 360,

  } = options;

  const breakMinutes =
    Number.isInteger(minimumBreakMinutes) &&
    minimumBreakMinutes >= 0
      ? minimumBreakMinutes
      : 10;

  const ranked = rankPlannerCandidates(
    candidates,
    { date }
  );

  const scheduled: ScheduledSuggestion[] = [];
  const unscheduled: RankedPlannerCandidate[] = [];

  // Copia temporal: nunca modificamos
  // el estado original del Planner.
  const temporaryBlocks = [...blocks];

  const existingSourceKeys = new Set(
    blocks
      .filter(
        (block) =>
          block.date === date &&
          block.status !== "skipped" &&
          block.sourceId !== null
      )
      .map(
        (block) =>
          `${block.source}:${block.sourceId}`
      )
  );
const existingDailyMinutes = blocks
  .filter(
    (block) =>
      block.date === date &&
      block.status !== "skipped"
  )
  .reduce(
    (total, block) =>
      total + block.durationMinutes,
    0
  );

let dailyScheduledMinutes =
  existingDailyMinutes;
  for (const candidate of ranked) {
    const sourceKey =
      candidate.sourceId !== null
        ? `${candidate.source}:${candidate.sourceId}`
        : null;

    // No sugerir una actividad ya programada.
    if (
      sourceKey &&
      existingSourceKeys.has(sourceKey)
    ) {
      continue;
    }
if (
  dailyScheduledMinutes +
    candidate.durationMinutes >
  maxDailyMinutes
) {
  unscheduled.push(candidate);
  continue;
}
    const availability =
      getPlannerAvailability(
        temporaryBlocks,
        {
          date,
          dayStart,
          dayEnd,
        }
      );

    const required =
      candidate.durationMinutes;

    const slot = availability.slots.find(
      (available) =>
        available.durationMinutes >= required
    );

    if (!slot) {
      unscheduled.push(candidate);
      continue;
    }

    const startMinutes = slot.startMinutes;
    const endMinutes =
      startMinutes + required;

    const suggestion: ScheduledSuggestion = {
      candidate,
      date,
      startTime:
        minutesToTime(startMinutes),
      endTime:
        minutesToTime(endMinutes),
      durationMinutes: required,
    };

    scheduled.push(suggestion);
dailyScheduledMinutes += required;
    if (sourceKey) {
      existingSourceKeys.add(sourceKey);
    }

    // Reservamos el bloque y, cuando cabe,
    // un descanso posterior.
    const reservedEnd = Math.min(
      slot.endMinutes,
      endMinutes + breakMinutes
    );

    temporaryBlocks.push({
      id: `suggestion-${candidate.id}`,
      title: candidate.title,
      date,
      startTime: suggestion.startTime,
      durationMinutes:
        reservedEnd - startMinutes,
      source: candidate.source,
      sourceId: candidate.sourceId,
      priority: candidate.priority,
      status: "planned",
      createdAt: new Date().toISOString(),
      completedAt: null,
    });
  }

  const totalScheduledMinutes =
    scheduled.reduce(
      (total, item) =>
        total + item.durationMinutes,
      0
    );

  const finalAvailability =
    getPlannerAvailability(
      temporaryBlocks,
      {
        date,
        dayStart,
        dayEnd,
      }
    );

  return {
    scheduled,
    unscheduled,
    totalScheduledMinutes,
    remainingMinutes:
      finalAvailability.availableMinutes,
  };
}
