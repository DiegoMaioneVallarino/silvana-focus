import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  CalendarEvent,
  CreateCalendarEvent,
} from "./calendar.types";

import {
  syncCalendarEvent,
  removeCalendarEventBlock,
} from "../planner/planner.calendar";

type CalendarActionResult =
  | { success: true; eventId: string }
  | { success: false; error: string };

interface CalendarState {
  events: CalendarEvent[];

  addEvent: (
    event: CreateCalendarEvent
  ) => CalendarActionResult;

  removeEvent: (id: string) => void;

  toggleCompleted: (id: string) => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      events: [],

      addEvent: (input) => {
        const event: CalendarEvent = {
          ...input,
          id: crypto.randomUUID(),
          completed: false,
          createdAt: new Date().toISOString(),
        };

        const result = syncCalendarEvent(event);

        if (!result.success) {
          return {
            success: false,
            error: result.error,
          };
        }

        set((state) => ({
          events: [...state.events, event],
        }));

        return {
          success: true,
          eventId: event.id,
        };
      },

      removeEvent: (id) => {
        set((state) => ({
          events: state.events.filter(
            (event) => event.id !== id
          ),
        }));

        removeCalendarEventBlock(id);
      },

      toggleCompleted: (id) => {
        const event = get().events.find(
          (item) => item.id === id
        );

        if (!event) return;

        const updated: CalendarEvent = {
          ...event,
          completed: !event.completed,
        };

        set((state) => ({
          events: state.events.map((item) =>
            item.id === id ? updated : item
          ),
        }));

        syncCalendarEvent(updated);
      },
    }),
    {
      name: "silvana-calendar",
    }
  )
);