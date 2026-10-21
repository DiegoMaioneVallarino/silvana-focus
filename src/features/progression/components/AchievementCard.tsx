
import {
  CheckCircle2,
  Flame,
  Timer,
  FolderCheck,
  GraduationCap,
  Lock,
} from "lucide-react";

import type {
  Achievement,
  AchievementId,
} from "../progression.types";

interface AchievementCardProps {
  achievement: Achievement;
}

const achievementIcons = {
  first_task: CheckCircle2,
  habit_streak_7: Flame,
  focus_10_hours: Timer,
  first_project: FolderCheck,
  five_goal_stages: GraduationCap,
} satisfies Record<AchievementId, typeof CheckCircle2>;

export function AchievementCard({
  achievement,
}: AchievementCardProps) {
  const Icon = achievementIcons[achievement.id];

  return (
    <article
      className={[
        "sf-card",
        "sf-achievement-card",
        achievement.unlocked ? "unlocked" : "locked",
      ].join(" ")}
    >
      <div className="sf-achievement-icon">
        {achievement.unlocked ? (
          <Icon size={23} />
        ) : (
          <Lock size={21} />
        )}
      </div>

      <div>
        <h4>{achievement.title}</h4>
        <p>{achievement.description}</p>

        <span>
          {achievement.unlocked
            ? "Logro desbloqueado"
            : "Por desbloquear"}
        </span>
      </div>
    </article>
  );
}
