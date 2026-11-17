
import type {
  SenseSession,
  SenseEvent,
  SenseEventType,
  SensePauseReason,
} from "./sense.types";

export function elapsedSeconds(
  start: string,
  end: string
): number {
  const difference =
    Date.parse(end) - Date.parse(start);

  if (!Number.isFinite(difference)) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(difference / 1000)
  );
}

export function getEffectiveSeconds(
  session: SenseSession,
  now = new Date().toISOString()
): number {
  const savedSeconds =
    session.effectiveMinutes * 60;

  if (
    session.status !== "active" ||
    !session.activeSince
  ) {
    return savedSeconds;
  }

  return (
    savedSeconds +
    elapsedSeconds(session.activeSince, now)
  );
}

export function transitionSession(
  session: SenseSession,
  type: SenseEventType,
  timestamp: string,
  reason: SensePauseReason = "unspecified"
): SenseSession | null {
  if (
    type === "paused" &&
    session.status === "active"
  ) {
    return {
      ...session,
      status: "paused",
      effectiveMinutes:
        getEffectiveSeconds(
          session,
          timestamp
        ) / 60,
      activeSince: null,
      lastPauseReason: reason,
    };
  }

  if (
    type === "resumed" &&
    session.status === "paused"
  ) {
    return {
      ...session,
      status: "active",
      activeSince: timestamp,
    };
  }

  if (
    (type === "completed" ||
      type === "abandoned") &&
    (session.status === "active" ||
      session.status === "paused")
  ) {
    return {
      ...session,
      status:
        type === "completed"
          ? "completed"
          : "abandoned",
      effectiveMinutes:
        getEffectiveSeconds(
          session,
          timestamp
        ) / 60,
      activeSince: null,
      endedAt: timestamp,
    };
  }

  return null;
}

export function createSenseEvent(
  sessionId: string,
  type: SenseEventType,
  timestamp: string,
  reason?: SensePauseReason
): SenseEvent {
  return {
    id: crypto.randomUUID(),
    sessionId,
    type,
    timestamp,
    source: "user",
    ...(reason ? { reason } : {}),
  };
}
