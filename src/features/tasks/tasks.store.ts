
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  Task,
  CreateTaskInput,
  TaskStatus,
} from "./tasks.types";
import {
  removeScheduledSourceBlocks,
} from "../planner/planner.sync";

interface TasksState {
  tasks: Task[];

  addTask: (input: CreateTaskInput) => void;

  updateStatus: (
    id: string,
    status: TaskStatus
  ) => void;

  deleteTask: (id: string) => void;

  addSubtask: (
    taskId: string,
    title: string
  ) => void;

  toggleSubtask: (
    taskId: string,
    subtaskId: string
  ) => void;

  // Vincular o desvincular una tarea de un proyecto
  setTaskProject: (
    taskId: string,
    projectId: string | null
  ) => void;
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: [],

      // Crear tarea
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
              projectId: input.projectId ?? null,
            },
          ],
        })),

      // Cambiar estado de tarea
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

     deleteTask: (id) => {
  set((state) => ({
    tasks: state.tasks.filter(
      (task) => task.id !== id
    ),
  }));

  removeScheduledSourceBlocks("task", id);
},

      // Añadir subtarea
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

      // Completar o desmarcar subtarea
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

      // NUEVO: asociar una tarea a un proyecto
      setTaskProject: (taskId, projectId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  projectId,
                }
              : task
          ),
        })),
    }),
    {
      name: "silvana-tasks",
    }
  )
);
