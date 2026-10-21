
import {
  Sun,
  CircleCheck,
  ChartNoAxesCombined,
  Heart,
} from "lucide-react";

import { dashboardStats } from "../data/dashboard.data";
import { useActivityStore } from "../../activity/activity.store";
import { useTasksStore } from "../../tasks/tasks.store";

import { useProjectsStore } from "../../projects/projects.store";
import { useHabitsStore } from "../../habits/habits.store";
import { getHabitStats } from "../../habits/habits.utils";
import {
  getTodaySessions,
  getTotalSeconds,
  formatDuration,
} from "../../activity/activity.utils";


const icons = {
  focus: Sun,
  tasks: CircleCheck,
  projects: ChartNoAxesCombined,
  habits: Heart,
};

export function DailyOverview() {

    const sessions = useActivityStore(
  (state) => state.sessions
);

const todaySessions = getTodaySessions(sessions);

const focusTime = formatDuration(
  getTotalSeconds(todaySessions)
);

const tasks = useTasksStore((state) => state.tasks);
const habits = useHabitsStore(
  (state) => state.habits
);

const activeHabits = habits.filter(
  (habit) => !habit.archivedAt
);

const scheduledHabits = activeHabits.filter(
  (habit) => getHabitStats(habit).scheduledToday
);

const completedHabits = scheduledHabits.filter(
  (habit) => getHabitStats(habit).completedToday
);

const habitsValue =
  `${completedHabits.length}/${scheduledHabits.length}`;
const completedTasks = tasks.filter(
  (task) => task.status === "completed"
).length;

const tasksValue = `${completedTasks} / ${tasks.length}`;
  return (
    <div className="sf-stats-grid">
      {dashboardStats.map((stat) => {
        const Icon = icons[
          stat.id as keyof typeof icons
        ];
const projects = useProjectsStore(
  (state) => state.projects
);

const activeProjects = projects.filter(
  (project) => project.status === "active"
).length;
        return (
          <div
            key={stat.id}
            className={`sf-card sf-stat-card ${stat.color}`}
          >
            <div className="sf-stat-icon">
              <Icon size={25} />
            </div>

            <div>
              <span className="sf-stat-label">
                {stat.label}
              </span>

                            <strong>
                {stat.id === "focus"
                    ? focusTime
                    : stat.id === "tasks"
                    ? tasksValue
                    : stat.id === "projects"
                        ? activeProjects
                        : stat.id === "habits"
                        ? habitsValue
                        : stat.value}
                </strong>
              <small>{stat.detail}</small>
            </div>
          </div>
        );
      })}
    </div>
  );
}
