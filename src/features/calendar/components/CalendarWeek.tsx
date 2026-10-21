
import {
  Check,
  Trash2,
  Play,
  Clock3,
} from "lucide-react";

import { useCalendarStore } from "../calendar.store";
import { useActivityStore } from "../../activity/activity.store";

import {
  getWeekDates,
  formatWeekday,
  fromLocalDateKey,
  getEventEndTime,
  toLocalDateKey,
} from "../calendar.utils";

import type { ActivityCategory } from "../../activity/activity.types";

interface CalendarWeekProps {
  weekStart: Date;
}

export function CalendarWeek({ weekStart }: CalendarWeekProps) {
  const events = useCalendarStore((state) => state.events);
  const removeEvent = useCalendarStore(
    (state) => state.removeEvent
  );
  const toggleCompleted = useCalendarStore(
    (state) => state.toggleCompleted
  );

  const activeTimer = useActivityStore(
    (state) => state.activeTimer
  );
  const startTimer = useActivityStore(
    (state) => state.startTimer
  );

  const week = getWeekDates(weekStart);
  const today = toLocalDateKey(new Date());

  function handleStartFocus(
    title: string,
    goalId: string | null,
    category: string
  ) {
    if (activeTimer) return;

    const activityCategory: ActivityCategory =
      category === "finance" ? "other" :
      category === "learning" ||
      category === "project" ||
      category === "exercise" ||
      category === "routine"
        ? category
        : "other";

    startTimer(title, goalId, activityCategory);
  }

  return (
    <div className="sf-calendar-week">
      {week.map((date) => {
        const dayEvents = events
          .filter((event) => event.date === date)
          .sort((a, b) =>
            a.startTime.localeCompare(b.startTime)
          );

        const isToday = date === today;

        return (
          <div
            key={date}
            className={`sf-calendar-day ${
              isToday ? "today" : ""
            }`}
          >
            <div className="sf-calendar-day-heading">
              <span>{formatWeekday(date)}</span>
              <strong>
                {fromLocalDateKey(date).getDate()}
              </strong>
            </div>

            <div className="sf-calendar-day-events">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className={`sf-calendar-event ${
                    event.category
                  } ${event.completed ? "completed" : ""}`}
                >
                  <span className="sf-calendar-event-time">
                    <Clock3 size={12} />
                    {event.startTime} –{" "}
                    {getEventEndTime(
                      event.startTime,
                      event.durationMinutes
                    )}
                  </span>

                  <strong>{event.title}</strong>

                  {event.description && (
                    <p>{event.description}</p>
                  )}

                  <div className="sf-calendar-event-actions">
                    <button
                      title={
                        event.completed
                          ? "Marcar pendiente"
                          : "Completar"
                      }
                      onClick={() =>
                        toggleCompleted(event.id)
                      }
                    >
                      <Check size={14} />
                    </button>

                    <button
                      title="Iniciar enfoque"
                      disabled={!!activeTimer || event.completed}
                      onClick={() =>
                        handleStartFocus(
                          event.title,
                          event.goalId,
                          event.category
                        )
                      }
                    >
                      <Play size={14} />
                    </button>

                    <button
                      title="Eliminar"
                      onClick={() => removeEvent(event.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
