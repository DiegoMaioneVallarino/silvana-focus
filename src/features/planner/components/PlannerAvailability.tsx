
import { useState } from "react";

import {
  Clock3,
  Sparkles,
} from "lucide-react";

import { usePlannerStore } from "../planner.store";

import {
  getPlannerAvailability,
} from "../planner.availability";

import "./PlannerAvailability.css";

interface PlannerAvailabilityProps {
  date: string;
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} h`;

  return `${hours} h ${rest} min`;
}

export function PlannerAvailability({
  date,
}: PlannerAvailabilityProps) {
  const blocks = usePlannerStore(
    (state) => state.blocks
  );

  const [dayStart, setDayStart] =
    useState("08:00");

  const [dayEnd, setDayEnd] =
    useState("22:00");

  const validRange =
    dayStart.length === 5 &&
    dayEnd.length === 5 &&
    dayStart < dayEnd;

  const availability = validRange
    ? getPlannerAvailability(blocks, {
        date,
        dayStart,
        dayEnd,
        minimumSlotMinutes: 15,
      })
    : null;

  return (
    <section className="sf-card sf-planner-availability">
      <div className="sf-planner-availability-heading">
        <div>
          <span className="sf-planner-availability-eyebrow">
            <Sparkles size={14} />
            SMART PLANNER
          </span>

          <h2>Disponibilidad del día</h2>

          <p>
            Descubre cuánto tiempo libre tienes
            para organizar tus actividades.
          </p>
        </div>

        <Clock3 size={22} color="#873cff" />
      </div>

      <div className="sf-planner-availability-settings">
        <label>
          Desde
          <input
            type="time"
            value={dayStart}
            onChange={(event) =>
              setDayStart(event.target.value)
            }
          />
        </label>

        <label>
          Hasta
          <input
            type="time"
            value={dayEnd}
            onChange={(event) =>
              setDayEnd(event.target.value)
            }
          />
        </label>
      </div>

      {!availability ? (
        <p className="sf-planner-availability-error">
          Selecciona un horario de inicio anterior
          al de finalización.
        </p>
      ) : (
        <>
          <div className="sf-planner-availability-stats">
            <div>
              <span>Tiempo libre</span>
              <strong>
                {formatDuration(
                  availability.availableMinutes
                )}
              </strong>
            </div>

            <div>
              <span>Tiempo ocupado</span>
              <strong>
                {formatDuration(
                  availability.occupiedMinutes
                )}
              </strong>
            </div>

            <div>
              <span>Espacios disponibles</span>
              <strong>
                {availability.slots.length}
              </strong>
            </div>
          </div>

          <div className="sf-planner-availability-slots">
            {availability.slots.length === 0 ? (
              <p>
                No hay espacios libres de al menos
                15 minutos en este horario.
              </p>
            ) : (
              availability.slots.map((slot) => (
                <div
                  key={`${slot.startTime}-${slot.endTime}`}
                  className="sf-planner-availability-slot"
                >
                  <div>
                    <strong>
                      {slot.startTime} – {slot.endTime}
                    </strong>

                    <span>
                      {formatDuration(
                        slot.durationMinutes
                      )}
                    </span>
                  </div>

                  <span className="sf-planner-availability-dot" />
                </div>
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
}
