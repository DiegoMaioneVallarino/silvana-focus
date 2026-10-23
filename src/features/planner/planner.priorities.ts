
import type {
  PlannerPriority,
  PlannerSource,
} from "./planner.types";

export interface PlannerCandidate {
  id: string;
  title: string;
  source: PlannerSource;
  sourceId: string | null;

  priority: PlannerPriority;
  durationMinutes: number;

  dueDate?: string | null;
  goalImportance?: number;

  createdAt?: string;
}

export interface RankedPlannerCandidate
  extends PlannerCandidate {
  score: number;
  reasons: string[];
}

export interface PlannerPriorityOptions {
  date: string;
}

const priorityWeights: Record<
  PlannerPriority,
  number
> = {
  low: 10,
  medium: 30,
  high: 55,
};

function parseLocalDate(
  value: string
): Date | null {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    year,
    month - 1,
    day
  );

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function getDaysUntil(
  date: string,
  dueDate: string
): number | null {
  const current = parseLocalDate(date);
  const due = parseLocalDate(dueDate);

  if (!current || !due) return null;

  const currentUTC = Date.UTC(
    current.getFullYear(),
    current.getMonth(),
    current.getDate()
  );

  const dueUTC = Date.UTC(
    due.getFullYear(),
    due.getMonth(),
    due.getDate()
  );

  return Math.round(
    (dueUTC - currentUTC) / 86400000
  );
}

export function scorePlannerCandidate(
  candidate: PlannerCandidate,
  options: PlannerPriorityOptions
): RankedPlannerCandidate {
  let score =
    priorityWeights[candidate.priority];

  const reasons: string[] = [];

  reasons.push(
    candidate.priority === "high"
      ? "Prioridad alta"
      : candidate.priority === "medium"
        ? "Prioridad media"
        : "Prioridad baja"
  );

  // Urgencia por fecha límite.
  if (candidate.dueDate) {
    const days = getDaysUntil(
      options.date,
      candidate.dueDate
    );

    if (days !== null) {
      if (days < 0) {
        score += 45;
        reasons.push("Fecha límite vencida");
      } else if (days === 0) {
        score += 40;
        reasons.push("Vence hoy");
      } else if (days === 1) {
        score += 30;
        reasons.push("Vence mañana");
      } else if (days <= 3) {
        score += 20;
        reasons.push("Vence pronto");
      } else if (days <= 7) {
        score += 10;
        reasons.push("Vence esta semana");
      }
    }
  }

  // Importancia del objetivo asociado.
  const importance = Math.max(
    0,
    Math.min(
      5,
      candidate.goalImportance ?? 0
    )
  );

  if (importance > 0) {
    score += importance * 5;
    reasons.push(
      "Contribuye a un objetivo"
    );
  }

  // Preferencia ligera por actividades
  // que requieren menos tiempo.
  if (candidate.durationMinutes <= 15) {
    score += 8;
    reasons.push("Actividad rápida");
  } else if (
    candidate.durationMinutes <= 30
  ) {
    score += 4;
  }

  return {
    ...candidate,
    score,
    reasons,
  };
}

export function rankPlannerCandidates(
  candidates: PlannerCandidate[],
  options: PlannerPriorityOptions
): RankedPlannerCandidate[] {
  return candidates
    .filter(
      (candidate) =>
        Number.isInteger(
          candidate.durationMinutes
        ) &&
        candidate.durationMinutes > 0
    )
    .map((candidate) =>
      scorePlannerCandidate(
        candidate,
        options
      )
    )
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      const aDue =
        a.dueDate ?? "9999-12-31";

      const bDue =
        b.dueDate ?? "9999-12-31";

      if (aDue !== bDue) {
        return aDue.localeCompare(bDue);
      }

      return a.id.localeCompare(b.id);
    });
}
