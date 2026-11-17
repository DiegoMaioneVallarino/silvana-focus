
import type {
  SenseSession,
} from "./sense.types";

import {
  getEffectiveSeconds,
} from "./sense.engine";

export function suspendUnconfirmedSession(
  session: SenseSession,
  lastConfirmedAt: string
): SenseSession {
  if (
    session.status !== "active" ||
    !session.activeSince
  ) {
    return session;
  }

  const start = Date.parse(session.activeSince);
  const confirmed = Date.parse(lastConfirmedAt);

  const safeTimestamp =
    Number.isFinite(confirmed) &&
    Number.isFinite(start) &&
    confirmed >= start
      ? lastConfirmedAt
      : session.activeSince;

  return {
    ...session,
    status: "paused",
    activeSince: null,
    effectiveMinutes:
      getEffectiveSeconds(
        session,
        safeTimestamp
      ) / 60,
    lastPauseReason: "unspecified",
  };
}
