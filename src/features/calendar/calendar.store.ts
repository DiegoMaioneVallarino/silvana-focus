
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  CalendarEvent,
  CreateCalendarEvent,
} from "./calendar.types";

interface CalendarState {
  events: CalendarEvent[];

  addEvent: (event: CreateCalendarEvent) => void;
  removeEvent: (id: string) => void;
  toggleCompleted: (id: string) => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      events: [],

      addEvent: (input) =>
        set((state) => ({
          events: [
            ...state.events,
            {
              ...input,
              id: crypto.randomUUID(),
              completed: false,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      removeEvent: (id) =>
        set((state) => ({
          events: state.events.filter(
            (event) => event.id !== id
          ),
        })),

      toggleCompleted: (id) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id
              ? { ...event, completed: !event.completed }
              : event
          ),
        })),
    }),
    {
      name: "silvana-calendar",
    }
  )
);
