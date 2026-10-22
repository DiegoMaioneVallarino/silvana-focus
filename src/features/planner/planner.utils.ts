import type {
  PlannerBlock,
  PlannerDaySummary,
} from "./planner.types";

export function timeToMinutes(
  time: string
): number {
  const [hours, minutes] = time
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
}

export function minutesToTime(
  totalMinutes: number
): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}`;
}

export function getBlockEndMinutes(
  block: Pick<
    PlannerBlock,
    "startTime" | "durationMinutes"
  >
): number {
  return (
    timeToMinutes(block.startTime) +
    block.durationMinutes
  );
}

export function blocksOverlap(
  first: Pick<
    PlannerBlock,
    "date" | "startTime" | "durationMinutes"
  >,
  second: Pick<
    PlannerBlock,
    "date" | "startTime" | "durationMinutes"
  >
): boolean {
  if (first.date !== second.date) {
    return false;
  }

  const firstStart = timeToMinutes(first.startTime);
  const secondStart = timeToMinutes(second.startTime);

  const firstEnd = getBlockEndMinutes(first);
  const secondEnd = getBlockEndMinutes(second);

  return (
    firstStart < secondEnd &&
    secondStart < firstEnd
  );
}

export function getDayBlocks(
  blocks: PlannerBlock[],
  date: string
): PlannerBlock[] {
  return blocks
    .filter((block) => block.date === date)
    .sort(
      (a, b) =>
        timeToMinutes(a.startTime) -
        timeToMinutes(b.startTime)
    );
}

export function getBlockConflicts(
  blocks: PlannerBlock[],
  candidate: Pick<
    PlannerBlock,
    "date" | "startTime" | "durationMinutes"
  >,
  excludeId?: string
): PlannerBlock[] {
  return blocks.filter(
    (block) =>
      block.id !== excludeId &&
      block.status !== "skipped" &&
      blocksOverlap(block, candidate)
  );
}

export function getDaySummary(
  blocks: PlannerBlock[],
  date: string
): PlannerDaySummary {
  const dayBlocks = getDayBlocks(blocks, date);

  const completedBlocks = dayBlocks.filter(
    (block) => block.status === "completed"
  );

  const skippedBlocks = dayBlocks.filter(
    (block) => block.status === "skipped"
  );

  const plannedMinutes = dayBlocks.reduce(
    (total, block) =>
      total + block.durationMinutes,
    0
  );

  const completedMinutes = completedBlocks.reduce(
    (total, block) =>
      total + block.durationMinutes,
    0
  );

  return {
    totalBlocks: dayBlocks.length,
    completedBlocks: completedBlocks.length,
    skippedBlocks: skippedBlocks.length,
    plannedMinutes,
    completedMinutes,
    completionPercent:
      dayBlocks.length > 0
        ? Math.round(
            (completedBlocks.length /
              dayBlocks.length) *
              100
          )
        : 0,
  };
}