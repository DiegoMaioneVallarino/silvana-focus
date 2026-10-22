import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  PlannerBlock,
  CreatePlannerBlockInput,
  PlannerBlockStatus,
} from "./planner.types";

import {
  getBlockConflicts,
  timeToMinutes,
} from "./planner.utils";

type PlannerResult =
  | { success: true; blockId: string }
  | {
      success: false;
      error: string;
    };

interface PlannerState {
  blocks: PlannerBlock[];

  addBlock: (
    input: CreatePlannerBlockInput
  ) => PlannerResult;

  updateBlock: (
    blockId: string,
    changes: Partial<CreatePlannerBlockInput>
  ) => PlannerResult;

  setBlockStatus: (
    blockId: string,
    status: PlannerBlockStatus
  ) => void;

  removeBlock: (blockId: string) => void;

  clearCompleted: (date: string) => void;
}

function validateBlock(
  block: Pick<
    PlannerBlock,
    | "title"
    | "date"
    | "startTime"
    | "durationMinutes"
  >
): string | null {
  if (!block.title.trim()) {
    return "El bloque necesita un título.";
  }

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(block.date) ||
    Number.isNaN(
      new Date(`${block.date}T12:00:00`).getTime()
    ) ||
    new Date(`${block.date}T12:00:00`)
      .toLocaleDateString("en-CA") !== block.date
  ) {
    // Validación adicional independiente de la zona horaria
    const [year, month, day] = block.date
      .split("-")
      .map(Number);

    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return "La fecha no es válida.";
    }
  }

  if (!/^\d{2}:\d{2}$/.test(block.startTime)) {
    return "El horario debe tener formato HH:mm.";
  }

  const start = timeToMinutes(block.startTime);

  if (
    !Number.isFinite(start) ||
    start < 0 ||
    start >= 1440
  ) {
    return "La hora de inicio no es válida.";
  }

  if (
    !Number.isInteger(block.durationMinutes) ||
    block.durationMinutes <= 0
  ) {
    return "La duración debe ser mayor que cero.";
  }

  if (start + block.durationMinutes > 1440) {
    return "El bloque no puede terminar después de medianoche.";
  }

  return null;
}

export const usePlannerStore =
  create<PlannerState>()(
    persist(
      (set, get) => ({
        blocks: [],

        addBlock: (input) => {
          const candidate: PlannerBlock = {
            id: crypto.randomUUID(),
            title: input.title.trim(),
            date: input.date,
            startTime: input.startTime,
            durationMinutes: input.durationMinutes,
            source: input.source ?? "manual",
            sourceId: input.sourceId ?? null,
            priority: input.priority ?? "medium",
            status: "planned",
            createdAt: new Date().toISOString(),
            completedAt: null,
          };

          const error = validateBlock(candidate);

          if (error) {
            return {
              success: false,
              error,
            };
          }

          const conflicts = getBlockConflicts(
            get().blocks,
            candidate
          );

          if (conflicts.length > 0) {
            return {
              success: false,
              error:
                "Ya existe una actividad en ese horario.",
            };
          }

          set((state) => ({
            blocks: [...state.blocks, candidate],
          }));

          return {
            success: true,
            blockId: candidate.id,
          };
        },

        updateBlock: (blockId, changes) => {
          const existing = get().blocks.find(
            (block) => block.id === blockId
          );

          if (!existing) {
            return {
              success: false,
              error: "Bloque no encontrado.",
            };
          }

          const candidate: PlannerBlock = {
            ...existing,
            ...changes,
            title:
              changes.title?.trim() ??
              existing.title,
          };

          const error = validateBlock(candidate);

          if (error) {
            return {
              success: false,
              error,
            };
          }

          const conflicts = getBlockConflicts(
            get().blocks,
            candidate,
            blockId
          );

          if (conflicts.length > 0) {
            return {
              success: false,
              error:
                "El nuevo horario coincide con otro bloque.",
            };
          }

          set((state) => ({
            blocks: state.blocks.map((block) =>
              block.id === blockId
                ? candidate
                : block
            ),
          }));

          return {
            success: true,
            blockId,
          };
        },

        setBlockStatus: (blockId, status) => {
          set((state) => ({
            blocks: state.blocks.map((block) =>
              block.id === blockId
                ? {
                    ...block,
                    status,
                    completedAt:
                      status === "completed"
                        ? new Date().toISOString()
                        : null,
                  }
                : block
            ),
          }));
        },

        removeBlock: (blockId) => {
          set((state) => ({
            blocks: state.blocks.filter(
              (block) => block.id !== blockId
            ),
          }));
        },

        clearCompleted: (date) => {
          set((state) => ({
            blocks: state.blocks.filter(
              (block) =>
                block.date !== date ||
                block.status !== "completed"
            ),
          }));
        },
      }),
      {
        name: "silvana-planner",
      }
    )
  );