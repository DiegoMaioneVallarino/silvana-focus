
import type {
  PlannerBlock,
} from "./planner.types";

import {
  timeToMinutes,
  minutesToTime,
  getBlockEndMinutes,
} from "./planner.utils";

export interface PlannerTimeSlot {
  startMinutes: number;
  endMinutes: number;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export interface PlannerAvailabilityOptions {
  date: string;
  dayStart: string;
  dayEnd: string;
  minimumSlotMinutes?: number;
}

export interface PlannerAvailabilityResult {
  date: string;
  dayStart: string;
  dayEnd: string;
  availableMinutes: number;
  occupiedMinutes: number;
  slots: PlannerTimeSlot[];
}

function createSlot(
  startMinutes: number,
  endMinutes: number
): PlannerTimeSlot {
  return {
    startMinutes,
    endMinutes,
    startTime: minutesToTime(startMinutes),
    endTime: minutesToTime(endMinutes),
    durationMinutes: endMinutes - startMinutes,
  };
}

export function getPlannerAvailability(
  blocks: PlannerBlock[],
  options: PlannerAvailabilityOptions
): PlannerAvailabilityResult {
  const {
    date,
    dayStart,
    dayEnd,
    minimumSlotMinutes = 1,
  } = options;

  const start = timeToMinutes(dayStart);
  const end = timeToMinutes(dayEnd);

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start < 0 ||
    end > 1440 ||
    start >= end
  ) {
    throw new Error(
      "El horario de disponibilidad no es válido."
    );
  }

  const occupied = blocks
    .filter(
      (block) =>
        block.date === date &&
        block.status !== "skipped"
    )
    .map((block) => ({
      start: Math.max(
        start,
        timeToMinutes(block.startTime)
      ),
      end: Math.min(
        end,
        getBlockEndMinutes(block)
      ),
    }))
    .filter(
      (interval) =>
        interval.end > interval.start
    )
    .sort((a, b) => a.start - b.start);

  const merged: Array<{
    start: number;
    end: number;
  }> = [];

  for (const interval of occupied) {
    const last = merged[merged.length - 1];

    if (last && interval.start <= last.end) {
      last.end = Math.max(
        last.end,
        interval.end
      );
    } else {
      merged.push({ ...interval });
    }
  }

  const slots: PlannerTimeSlot[] = [];

  let cursor = start;

  for (const interval of merged) {
    if (interval.start > cursor) {
      const slot = createSlot(
        cursor,
        interval.start
      );

      if (
        slot.durationMinutes >=
        minimumSlotMinutes
      ) {
        slots.push(slot);
      }
    }

    cursor = Math.max(
      cursor,
      interval.end
    );
  }

  if (cursor < end) {
    const slot = createSlot(cursor, end);

    if (
      slot.durationMinutes >=
      minimumSlotMinutes
    ) {
      slots.push(slot);
    }
  }

  const occupiedMinutes = merged.reduce(
    (total, interval) =>
      total + interval.end - interval.start,
    0
  );

  return {
    date,
    dayStart,
    dayEnd,
    availableMinutes:
      end - start - occupiedMinutes,
    occupiedMinutes,
    slots,
  };
}

export function findAvailableSlots(
  blocks: PlannerBlock[],
  options: PlannerAvailabilityOptions,
  requiredMinutes: number
): PlannerTimeSlot[] {
  if (
    !Number.isInteger(requiredMinutes) ||
    requiredMinutes <= 0
  ) {
    return [];
  }

  const availability = getPlannerAvailability(
    blocks,
    options
  );

  return availability.slots.filter(
    (slot) =>
      slot.durationMinutes >= requiredMinutes
  );
}
