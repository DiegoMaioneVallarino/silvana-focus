import type {
  CalendarEvent,
} from "../calendar/calendar.types";

import {
  usePlannerStore,
} from "./planner.store";

import {
  scheduleSource,
} from "./planner.sync";

export type CalendarSyncResult =
  | { success: true; blockId: string }
  | { success: false; error: string };

export function syncCalendarEvent(
  event: CalendarEvent
): CalendarSyncResult {
  const store = usePlannerStore.getState();

  const existing = store.blocks.find(
    (block) =>
      block.source === "calendar" &&
      block.sourceId === event.id
  );

  if (existing) {
    const result = store.updateBlock(existing.id, {
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      durationMinutes: event.durationMinutes,
    });

    if (!result.success) {
      return result;
    }

    store.setBlockStatus(
      existing.id,
      event.completed ? "completed" : "planned"
    );

    return {
      success: true,
      blockId: existing.id,
    };
  }

  const result = scheduleSource({
    source: "calendar",
    sourceId: event.id,
    title: event.title,
    date: event.date,
    startTime: event.startTime,
    durationMinutes: event.durationMinutes,
    priority: "medium",
  });

  if (result.success && event.completed) {
    usePlannerStore
      .getState()
      .setBlockStatus(result.blockId, "completed");
  }

  return result;
}

export function removeCalendarEventBlock(
  eventId: string
): void {
  const store = usePlannerStore.getState();

  const blocks = store.blocks.filter(
    (block) =>
      block.source === "calendar" &&
      block.sourceId === eventId
  );

  blocks.forEach((block) => {
    usePlannerStore
      .getState()
      .removeBlock(block.id);
  });
}export interface CalendarReconciliationResult {
  imported: number;
  alreadyLinked: number;
  failed: number;
}

export function reconcileCalendarEvents(
  events: CalendarEvent[]
): CalendarReconciliationResult {
  const result: CalendarReconciliationResult = {
    imported: 0,
    alreadyLinked: 0,
    failed: 0,
  };

  for (const event of events) {
    const existing = usePlannerStore
      .getState()
      .blocks.some(
        (block) =>
          block.source === "calendar" &&
          block.sourceId === event.id
      );

    if (existing) {
      result.alreadyLinked++;
      continue;
    }

    const syncResult = syncCalendarEvent(event);

    if (syncResult.success) {
      result.imported++;
    } else {
      result.failed++;
      console.warn(
        `[Calendar Sync] No se pudo importar "${event.title}":`,
        syncResult.error
      );
    }
  }

  return result;
}