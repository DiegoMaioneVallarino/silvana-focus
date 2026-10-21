
import { useEffect } from "react";

import { useProgressionStore } from "../progression.store";

import { useTasksStore } from "../../tasks/tasks.store";
import { useHabitsStore } from "../../habits/habits.store";
import { useProjectsStore } from "../../projects/projects.store";
import { useGoalsStore } from "../../goals/goals.store";
import { useActivityStore } from "../../activity/activity.store";

export function ProgressionSync() {
  useEffect(() => {
    const sync = () => {
      useProgressionStore
        .getState()
        .syncProgression();
    };

    const unsubscribers = [
      useTasksStore.subscribe(sync),
      useHabitsStore.subscribe(sync),
      useProjectsStore.subscribe(sync),
      useGoalsStore.subscribe(sync),
      useActivityStore.subscribe(sync),
    ];

    sync();

    return () => {
      unsubscribers.forEach((unsubscribe) =>
        unsubscribe()
      );
    };
  }, []);

  return null;
}
