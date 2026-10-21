
import type {
  XPSource,
  AchievementId,
} from "./progression.types";

export const XP_REWARDS: Record<XPSource, number> = {
  task: 20,
  habit: 15,
  focus: 10,
  goal_stage: 50,
  project: 100,
  academy_lesson: 25,
};

export const MIN_FOCUS_SECONDS = 5 * 60;

// XP acumulado necesario para alcanzar cada nivel.
export const LEVEL_THRESHOLDS = [
  0,
  100,
  250,
  450,
  700,
  1000,
  1350,
  1750,
  2200,
  2700,
];

export function getLevelThreshold(level: number): number {
  if (level <= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[level - 1];
  }

  // Continuación progresiva a partir del nivel 10.
  const extraLevels = level - LEVEL_THRESHOLDS.length;
  const lastThreshold =
    LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

  return (
    lastThreshold +
    500 * extraLevels +
    25 * extraLevels * (extraLevels + 1)
  );
}

export function getLevelTitle(level: number): string {
  if (level >= 50) return "Leyenda";
  if (level >= 30) return "Maestro";
  if (level >= 20) return "Visionario";
  if (level >= 15) return "Arquitecto";
  if (level >= 10) return "Estratega";
  if (level >= 7) return "Explorador";
  if (level >= 4) return "Aprendiz";
  return "Principiante";
}

export const ACHIEVEMENT_DEFINITIONS: {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
}[] = [
  {
    id: "first_task",
    title: "Primer paso",
    description: "Completa tu primera tarea.",
    icon: "check-circle",
  },
  {
    id: "habit_streak_7",
    title: "Disciplina",
    description:
      "Consigue una racha de 7 cumplimientos en un hábito.",
    icon: "flame",
  },
  {
    id: "focus_10_hours",
    title: "Enfoque profundo",
    description:
      "Acumula 10 horas de sesiones de concentración.",
    icon: "timer",
  },
  {
    id: "first_project",
    title: "Constructor",
    description: "Finaliza tu primer proyecto.",
    icon: "folder-check",
  },
  {
    id: "five_goal_stages",
    title: "Aprendiz constante",
    description: "Completa 5 etapas de objetivos.",
    icon: "graduation-cap",
  },
];
