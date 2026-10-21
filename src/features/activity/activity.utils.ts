
import type { ActivitySession } from "./activity.types";
import { toLocalDateKey } from "../streaks/streaks.utils";

export function getTodaySessions(
  sessions: ActivitySession[]
): ActivitySession[] {
  const today = toLocalDateKey(new Date());

  return sessions.filter(
    (session) =>
      toLocalDateKey(new Date(session.endedAt)) === today
  );
}

export function getTotalSeconds(
  sessions: ActivitySession[]
): number {
  return sessions.reduce(
    (total, session) => total + session.durationSeconds,
    0
  );
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  }

  return `${minutes}m ${String(remaining).padStart(2, "0")}s`;
}

export function formatTimer(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;

  return [hours, minutes, remaining]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}
