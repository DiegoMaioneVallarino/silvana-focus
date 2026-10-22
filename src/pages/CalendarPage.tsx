
import { useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";

import { CalendarWeek } from "../features/calendar/components/CalendarWeek";
import { EventForm } from "../features/calendar/components/EventForm";

import { useCalendarStore } from "../features/calendar/calendar.store";

import {
  reconcileCalendarEvents,
} from "../features/planner/planner.calendar";

import {
  addDays,
  toLocalDateKey,
  fromLocalDateKey,
} from "../features/calendar/calendar.utils";

import "./CalendarPage.css";

export function CalendarPage() {
  const [selectedWeek, setSelectedWeek] = useState(
    toLocalDateKey(new Date())
  );

  const events = useCalendarStore(
    (state) => state.events
  );

  useEffect(() => {
    reconcileCalendarEvents(events);
  }, [events]);

  function changeWeek(days: number) {
    setSelectedWeek((current) => addDays(current, days));
  }

  return (
    <div className="sf-calendar-page">
      <div className="sf-calendar-page-header">
        <div>
          <h2>Mi calendario</h2>

          <p className="sf-muted">
            Planifica tu tiempo y organiza tus actividades.
          </p>
        </div>

        <div className="sf-calendar-navigation">
          <button
            onClick={() => changeWeek(-7)}
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={() =>
              setSelectedWeek(
                toLocalDateKey(new Date())
              )
            }
          >
            Hoy
          </button>

          <button
            onClick={() => changeWeek(7)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="sf-calendar-layout">
        <section className="sf-card sf-calendar-main">
          <div className="sf-calendar-title">
            <CalendarDays
              size={20}
              color="#ff5a12"
            />

            <h3>
              Semana del{" "}
              {fromLocalDateKey(
                selectedWeek
              ).toLocaleDateString(
                "es-MX",
                {
                  day: "numeric",
                  month: "long",
                }
              )}
            </h3>
          </div>

          <CalendarWeek
            weekStart={fromLocalDateKey(
              selectedWeek
            )}
          />
        </section>

        <aside className="sf-card sf-calendar-sidebar">
          <EventForm />
        </aside>
      </div>
    </div>
  );
}
