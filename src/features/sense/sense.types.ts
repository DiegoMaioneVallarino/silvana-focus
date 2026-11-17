
export type SenseSessionStatus =
  | "active"
  | "paused"
  | "completed"
  | "abandoned";

export type SenseActivityMode =
  | "fixed"
  | "flexible"
  | "accumulated"
  | "opportunistic";

export type SensePauseReason =
  | "rest"
  | "food"
  | "family"
  | "unexpected_work"
  | "distraction"
  | "other"
  | "unspecified";

export type SenseEventType =
  | "started"
  | "paused"
  | "resumed"
  | "completed"
  | "abandoned";

export interface SenseConstraints {
  mode: SenseActivityMode;
  deadlineRigidity: number;
  interruptibility: number;
  fragmentationTolerance: number;
  resumptionCostMinutes: number;
  preferredSessionMinutes: number;
  targetEffectiveMinutes: number | null;
}

export interface SenseSession {
  id: string;
  blockId: string;
  title: string;
  status: SenseSessionStatus;
  startedAt: string;
  endedAt: string | null;
  activeSince: string | null;
  effectiveMinutes: number;
  constraints: SenseConstraints;
  lastPauseReason: SensePauseReason | null;
}

export interface SenseEvent {
  id: string;
  sessionId: string;
  type: SenseEventType;
  timestamp: string;
  reason?: SensePauseReason;
  source: "user" | "integration" | "system";
}

export interface SenseSessionReport {
  sessionId: string;
  outcome:
    | "completed"
    | "partial"
    | "blocked"
    | "not_started";
  difficulty: number | null;
  notes: string;
  reportedAt: string;
}
