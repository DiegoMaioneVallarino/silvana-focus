
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from "./projects.types";

interface ProjectsState {
  projects: Project[];

  addProject: (input: CreateProjectInput) => string;
  updateProject: (
    id: string,
    changes: UpdateProjectInput
  ) => void;
  deleteProject: (id: string) => void;
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set) => ({
      projects: [],

      addProject: (input) => {
        const id = crypto.randomUUID();

        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...input,
              id,
              status: "planning",
              createdAt: new Date().toISOString(),
              completedAt: null,
            },
          ],
        }));

        return id;
      },

      updateProject: (id, changes) =>
        set((state) => ({
          projects: state.projects.map((project) => {
            if (project.id !== id) return project;

            const status = changes.status ?? project.status;

            return {
              ...project,
              ...changes,
              completedAt:
                status === "completed"
                  ? project.completedAt ??
                    new Date().toISOString()
                  : null,
            };
          }),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter(
            (project) => project.id !== id
          ),
        })),
    }),
    {
      name: "silvana-projects",
    }
  )
);
