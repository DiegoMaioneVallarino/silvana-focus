
import { Award } from "lucide-react";

import { useProgressionStore } from "../features/progression/progression.store";

import {
  calculateLevel,
  getActiveXP,
  getLifetimeXP,
  getTodayXP,
} from "../features/progression/progression.utils";

import {
  ACHIEVEMENT_DEFINITIONS,
} from "../features/progression/progression.config";

import { LevelCard } from "../features/progression/components/LevelCard";
import { XPHistory } from "../features/progression/components/XPHistory";
import { AchievementCard } from "../features/progression/components/AchievementCard";

import "./ProgressPage.css";

export function ProgressPage() {
  const rewards = useProgressionStore(
    (state) => state.rewards
  );

  const achievements = useProgressionStore(
    (state) => state.achievements
  );

  const totalXP = getActiveXP(rewards);
  const lifetimeXP = getLifetimeXP(rewards);
  const todayXP = getTodayXP(rewards);

  const level = calculateLevel(totalXP);

  const achievementItems = ACHIEVEMENT_DEFINITIONS.map(
    (definition) => ({
      ...definition,
      unlocked: !!achievements[definition.id],
      unlockedAt:
        achievements[definition.id] ?? null,
    })
  );

  const unlockedCount = achievementItems.filter(
    (achievement) => achievement.unlocked
  ).length;

  return (
    <div className="sf-progress-page">
      <header className="sf-progress-header">
        <div>
          <h2>Mi progreso</h2>

          <p className="sf-muted">
            Cada pequeño avance cuenta.
          </p>
        </div>
      </header>

      <LevelCard
        level={level}
        todayXP={todayXP}
        lifetimeXP={lifetimeXP}
      />

      <section className="sf-progress-achievements">
        <div className="sf-progress-section-title">
          <div>
            <Award
              size={20}
              color="#873cff"
            />

            <h3>Logros</h3>
          </div>

          <span>
            {unlockedCount} / {achievementItems.length}
          </span>
        </div>

        <div className="sf-achievements-grid">
          {achievementItems.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
            />
          ))}
        </div>
      </section>

      <XPHistory rewards={rewards} />
    </div>
  );
}
