
import type {
  SenseConstraints,
  SenseActivityMode,
} from "./sense.types";

const clamp = (value: number) =>
  Math.max(0, Math.min(1, value));

export function createSenseConstraints(
  mode: SenseActivityMode = "flexible",
  overrides: Partial<SenseConstraints> = {}
): SenseConstraints {
  const defaults: SenseConstraints = {
    mode,
    deadlineRigidity:
      mode === "fixed" ? 1 : 0.3,
    interruptibility:
      mode === "fixed" ? 0.3 : 0.8,
    fragmentationTolerance:
      mode === "accumulated" ? 1 : 0.6,
    resumptionCostMinutes: 5,
    preferredSessionMinutes: 45,
    targetEffectiveMinutes: null,
  };

  const result = {
    ...defaults,
    ...overrides,
    mode,
  };

  return {
    ...result,
    deadlineRigidity:
      clamp(result.deadlineRigidity),
    interruptibility:
      clamp(result.interruptibility),
    fragmentationTolerance:
      clamp(result.fragmentationTolerance),
    resumptionCostMinutes:
      Math.max(0, result.resumptionCostMinutes),
    preferredSessionMinutes:
      Math.max(1, result.preferredSessionMinutes),
    targetEffectiveMinutes:
      result.targetEffectiveMinutes === null
        ? null
        : Math.max(
            1,
            result.targetEffectiveMinutes
          ),
  };
}

export function canFragmentActivity(
  constraints: SenseConstraints
): boolean {
  return (
    constraints.mode === "accumulated" ||
    constraints.fragmentationTolerance >= 0.5
  );
}

export function shouldSuggestShorterSession(
  constraints: SenseConstraints,
  interruptions: number
): boolean {
  return (
    interruptions >= 2 &&
    constraints.fragmentationTolerance >= 0.5
  );
}
