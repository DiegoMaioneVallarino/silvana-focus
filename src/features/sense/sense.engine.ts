
import type {
  SenseSession,
  SenseEvent,
  SenseEventType,
  SensePauseReason,
  SenseActivity,
  SenseActivityProgress,
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
        getEffectiveSeconds(session, timestamp) / 60,
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
        getEffectiveSeconds(session, timestamp) / 60,
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
  reason?: SensePauseReason,
  source: SenseEvent["source"] = "user"
): SenseEvent {
  return {
    id: crypto.randomUUID(),
    sessionId,
    type,
    timestamp,
    source,
    ...(reason ? { reason } : {}),
  };
}

export function getActivityProgress(
  activity: SenseActivity,
  sessions: SenseSession[],
  now = new Date().toISOString()
): SenseActivityProgress {
  const related = sessions.filter(
    (session) =>
      session.activityId === activity.id
  );

  const seconds = related.reduce(
    (total, session) =>
      total + getEffectiveSeconds(session, now),
    0
  );

  const effectiveMinutes = seconds / 60;
  const targetMinutes =
    activity.constraints.targetEffectiveMinutes;

  return {
    activityId: activity.id,
    effectiveMinutes,
    targetMinutes,
    remainingMinutes:
      targetMinutes === null
        ? null
        : Math.max(
            0,
            targetMinutes - effectiveMinutes
          ),
    sessionCount: related.length,
  };
}
