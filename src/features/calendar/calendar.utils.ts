
import {
  addDays,
  getWeekDates,
  fromLocalDateKey,
  toLocalDateKey,
} from "../streaks/streaks.utils";

export {
  addDays,
  getWeekDates,
  fromLocalDateKey,
  toLocalDateKey,
};

export function formatCalendarDate(dateKey: string) {
  return fromLocalDateKey(dateKey).toLocaleDateString(
    "es-MX",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
    }
  );
}

export function formatWeekday(dateKey: string) {
  return fromLocalDateKey(dateKey).toLocaleDateString(
    "es-MX",
    {
      weekday: "short",
    }
  );
}

export function getEventEndTime(
  startTime: string,
  durationMinutes: number
) {
  const [hours, minutes] = startTime.split(":").map(Number);

  const total = hours * 60 + minutes + durationMinutes;

  const endHours = Math.floor(total / 60) % 24;
  const endMinutes = total % 60;

  return `${String(endHours).padStart(2, "0")}:${String(
    endMinutes
  ).padStart(2, "0")}`;
}
