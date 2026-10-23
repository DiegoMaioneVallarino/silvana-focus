
import {
  usePlannerStore,
} from "./planner.store";

import {
  getBlockConflicts,
  timeToMinutes,
} from "./planner.utils";

import type {
  PlannerBlock,
} from "./planner.types";

import type {
  ScheduledSuggestion,
} from "./planner.scheduler";

export interface PlannerConfirmationResult {
  success: boolean;
  createdBlockIds: string[];
  error?: string;
}

export function confirmPlannerSchedule(
  suggestions: ScheduledSuggestion[]
): PlannerConfirmationResult {
  if (suggestions.length === 0) {
    return {
      success: false,
      createdBlockIds: [],
      error: "No hay actividades seleccionadas.",
    };
  }

  const store = usePlannerStore.getState();

  const existingBlocks = [...store.blocks];

  const pendingBlocks: PlannerBlock[] = [];

  const now = new Date().toISOString();

  for (const suggestion of suggestions) {
    const { candidate } = suggestion;

    const start = timeToMinutes(
      suggestion.startTime
    );

    const duration =
      suggestion.durationMinutes;

    if (
      !/^\d{2}:\d{2}$/.test(
        suggestion.startTime
      ) ||
      !Number.isInteger(duration) ||
      duration <= 0 ||
      !Number.isFinite(start) ||
      start < 0 ||
      start >= 1440 ||
      start + duration > 1440
    ) {
      return {
        success: false,
        createdBlockIds: [],
        error: `Horario inválido: ${candidate.title}`,
      };
    }

    const duplicate = [
      ...existingBlocks,
      ...pendingBlocks,
    ].some(
      (block) =>
        block.date === suggestion.date &&
        block.status !== "skipped" &&
        candidate.sourceId !== null &&
        block.source === candidate.source &&
        block.sourceId === candidate.sourceId
    );

    if (duplicate) {
      return {
        success: false,
        createdBlockIds: [],
        error:
          `"${candidate.title}" ya está programada.`,
      };
    }

    const candidateBlock: PlannerBlock = {
      id: crypto.randomUUID(),
      title: candidate.title,
      date: suggestion.date,
      startTime: suggestion.startTime,
      durationMinutes: duration,
      source: candidate.source,
      sourceId: candidate.sourceId,
      priority: candidate.priority,
      status: "planned",
      createdAt: now,
      completedAt: null,
    };

    const conflicts = getBlockConflicts(
      [
        ...existingBlocks,
        ...pendingBlocks,
      ],
      candidateBlock
    );

    if (conflicts.length > 0) {
      return {
        success: false,
        createdBlockIds: [],
        error:
          `Conflicto de horario: ${candidate.title}`,
      };
    }

    pendingBlocks.push(candidateBlock);
  }

  // Guardado mediante el store existente.
  // Si falla, revertimos los bloques creados.
  const createdBlockIds: string[] = [];

  for (const block of pendingBlocks) {
    const result =
      usePlannerStore.getState().addBlock({
        title: block.title,
        date: block.date,
        startTime: block.startTime,
        durationMinutes:
          block.durationMinutes,
        source: block.source,
        sourceId: block.sourceId,
        priority: block.priority,
      });

    if (!result.success) {
      for (const id of createdBlockIds) {
        usePlannerStore
          .getState()
          .removeBlock(id);
      }

      return {
        success: false,
        createdBlockIds: [],
        error: result.error,
      };
    }

    createdBlockIds.push(result.blockId);
  }

  return {
    success: true,
    createdBlockIds,
  };
}
