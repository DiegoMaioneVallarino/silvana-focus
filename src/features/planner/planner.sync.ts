import { usePlannerStore } from "./planner.store";

import type {
  PlannerPriority,
  PlannerSource,
} from "./planner.types";

export interface ScheduleSourceInput {
  source: Exclude<PlannerSource, "manual">;
  sourceId: string;
  title: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  priority?: PlannerPriority;
}

export type ScheduleSourceResult =
  | { success: true; blockId: string }
  | { success: false; error: string };

export function scheduleSource(
  input: ScheduleSourceInput
): ScheduleSourceResult {
  const store = usePlannerStore.getState();

  if (!input.sourceId.trim()) {
    return {
      success: false,
      error: "La actividad necesita un identificador.",
    };
  }

  const existing = store.blocks.find(
    (block) =>
      block.source === input.source &&
      block.sourceId === input.sourceId &&
      block.date === input.date
  );

  if (existing) {
    return {
      success: false,
      error: "Esta actividad ya está planificada para ese día.",
    };
  }

  return store.addBlock({
    title: input.title,
    date: input.date,
    startTime: input.startTime,
    durationMinutes: input.durationMinutes,
    priority: input.priority ?? "medium",
    source: input.source,
    sourceId: input.sourceId,
  });
}

export function getScheduledSourceBlocks(
  source: Exclude<PlannerSource, "manual">,
  sourceId: string
) {
  return usePlannerStore
    .getState()
    .blocks.filter(
      (block) =>
        block.source === source &&
        block.sourceId === sourceId
    );
}

export function removeScheduledSourceBlocks(
  source: Exclude<PlannerSource, "manual">,
  sourceId: string
): void {
  const store = usePlannerStore.getState();

  const matchingBlocks = store.blocks.filter(
    (block) =>
      block.source === source &&
      block.sourceId === sourceId
  );

  matchingBlocks.forEach((block) => {
    usePlannerStore.getState().removeBlock(block.id);
  });
}