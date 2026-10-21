
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  Task,
  CreateTaskInput,
  TaskStatus,
} from "./tasks.types";

interface TasksState {
  tasks: Task[];
  addTask: (input: CreateTaskInput) => void;
  updateStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: [],

      addTask: (input) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...input,
              id: crypto.randomUUID(),
              status: "pending",
              subtasks: [],
              createdAt: new Date().toISOString(),
              completedAt: null,
            },
          ],
        })),

      updateStatus: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status,
                  completedAt:
                    status === "completed"
                      ? task.completedAt ??
                        new Date().toISOString()
                      : null,
                }
              : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter(
            (task) => task.id !== id
          ),
        })),

      addSubtask: (taskId, title) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: [
                    ...task.subtasks,
                    {
                      id: crypto.randomUUID(),
                      title,
                      completed: false,
                    },
                  ],
                }
              : task
          ),
        })),

      toggleSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: task.subtasks.map((subtask) =>
                    subtask.id === subtaskId
                      ? {
                          ...subtask,
                          completed: !subtask.completed,
                        }
                      : subtask
                  ),
                }
              : task
          ),
        })),
    }),
    { name: "silvana-tasks" }
  )
);
