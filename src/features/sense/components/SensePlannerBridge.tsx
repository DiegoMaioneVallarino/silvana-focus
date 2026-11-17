
import { useMemo } from "react";

import {
  usePlannerStore,
} from "../../planner/planner.store";

import {
  useSenseStore,
} from "../sense.store";

import {
  SenseSessionPanel,
} from "./SenseSessionPanel";

interface Props {
  date: string;
}

export function SensePlannerBridge({
  date,
}: Props) {
  const blocks = usePlannerStore(
    (state) => state.blocks
  );

  const activeSessionId = useSenseStore(
    (state) => state.activeSessionId
  );

  const sessions = useSenseStore(
    (state) => state.sessions
  );

  const currentSession = sessions.find(
    (session) =>
      session.id === activeSessionId
  );

  const block = useMemo(() => {
    if (currentSession) {
      return (
        blocks.find(
          (item) =>
            item.id === currentSession.blockId
        ) ?? null
      );
    }

    const now = new Date();
    const currentMinutes =
      now.getHours() * 60 +
      now.getMinutes();

    return (
      blocks
        .filter(
          (item) =>
            item.date === date &&
            item.status === "planned"
        )
        .sort(
          (a, b) =>
            a.startTime.localeCompare(
              b.startTime
            )
        )
        .find((item) => {
          const [hours, minutes] =
            item.startTime
              .split(":")
              .map(Number);

          const start =
            hours * 60 + minutes;

          return (
            currentMinutes >= start &&
            currentMinutes <
              start + item.durationMinutes
          );
        }) ?? null
    );
  }, [
    blocks,
    date,
    currentSession,
  ]);

  if (!block) {
    return null;
  }

  return (
    <SenseSessionPanel block={block} />
  );
}
