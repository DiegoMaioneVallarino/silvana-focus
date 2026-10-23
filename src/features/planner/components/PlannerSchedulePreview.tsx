
import { useMemo, useState } from "react";

import {
  Sparkles,
  Clock3,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { usePlannerStore } from "../planner.store";

import {
  generatePlannerSchedule,
} from "../planner.scheduler";

import type {
  PlannerCandidate,
} from "../planner.priorities";

import "./PlannerSchedulePreview.css";

interface Props {
  date: string;
}

const demoCandidates: PlannerCandidate[] = [
  {
    id: "demo-task-1",
    title: "Avanzar proyecto principal",
    source: "task",
    sourceId: "demo-task-1",
    priority: "high",
    durationMinutes: 90,
    goalImportance: 5,
  },
  {
    id: "demo-academy-1",
    title: "Estudiar programación",
    source: "academy",
    sourceId: "demo-academy-1",
    priority: "medium",
    durationMinutes: 45,
    goalImportance: 4,
  },
  {
    id: "demo-habit-1",
    title: "Ejercicio diario",
    source: "habit",
    sourceId: "demo-habit-1",
    priority: "medium",
    durationMinutes: 30,
  },
  {
    id: "demo-task-2",
    title: "Organizar archivos",
    source: "task",
    sourceId: "demo-task-2",
    priority: "low",
    durationMinutes: 20,
  },
];

export function PlannerSchedulePreview({
  date,
}: Props) {
  const blocks = usePlannerStore(
    (state) => state.blocks
  );

  const [dayStart, setDayStart] =
    useState("08:00");

  const [dayEnd, setDayEnd] =
    useState("20:00");

  const [breakMinutes, setBreakMinutes] =
    useState(10);

  const [generation, setGeneration] =
    useState(0);

  const validRange =
    /^\d{2}:\d{2}$/.test(dayStart) &&
    /^\d{2}:\d{2}$/.test(dayEnd) &&
    dayStart < dayEnd;

  const result = useMemo(() => {
    if (!validRange) return null;

    return generatePlannerSchedule(
      blocks,
      demoCandidates,
      {
        date,
        dayStart,
        dayEnd,
        minimumBreakMinutes:
          breakMinutes,
      }
    );
  }, [
    blocks,
    date,
    dayStart,
    dayEnd,
    breakMinutes,
    generation,
    validRange,
  ]);

  return (
    <section className="sf-card sf-schedule-preview">
      <header className="sf-schedule-preview-header">
        <div>
          <span className="sf-schedule-preview-eyebrow">
            <Sparkles size={14} />
            SMART PLANNER
          </span>

          <h2>Organizar mi día</h2>

          <p>
            Genera una propuesta de horarios
            respetando tus compromisos.
          </p>
        </div>

        <button
          type="button"
          className="sf-schedule-generate"
          onClick={() =>
            setGeneration((value) => value + 1)
          }
        >
          <RefreshCw size={15} />
          Generar
        </button>
      </header>

      <div className="sf-schedule-settings">
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

        <label>
          Descanso (min)
          <input
            type="number"
            min={0}
            max={60}
            value={breakMinutes}
            onChange={(event) =>
              setBreakMinutes(
                Math.max(
                  0,
                  Number(event.target.value)
                )
              )
            }
          />
        </label>
      </div>

      {!result ? (
        <p className="sf-schedule-error">
          <AlertCircle size={15} />
          Selecciona un horario válido.
        </p>
      ) : (
        <>
          <div className="sf-schedule-stats">
            <span>
              {result.scheduled.length}
              {" "}actividades sugeridas
            </span>

            <span>
              {result.totalScheduledMinutes}
              {" "}minutos de actividad
            </span>

            <span>
              {result.remainingMinutes}
              {" "}minutos disponibles
            </span>
          </div>

          {result.scheduled.length === 0 ? (
            <p className="sf-schedule-empty">
              No encontramos espacio para
              las actividades propuestas.
            </p>
          ) : (
            <div className="sf-schedule-list">
              {result.scheduled.map(
                (suggestion) => (
                  <article
                    key={suggestion.candidate.id}
                    className="sf-schedule-item"
                  >
                    <div className="sf-schedule-time">
                      <Clock3 size={15} />

                      <strong>
                        {suggestion.startTime}
                        {" – "}
                        {suggestion.endTime}
                      </strong>
                    </div>

                    <div className="sf-schedule-info">
                      <strong>
                        {suggestion.candidate.title}
                      </strong>

                      <span>
                        {
                          suggestion.candidate
                            .durationMinutes
                        } min · Prioridad{" "}
                        {
                          suggestion.candidate
                            .priority
                        }
                      </span>
                    </div>

                    <span className="sf-schedule-score">
                      {suggestion.candidate.score}
                      {" "}pts
                    </span>
                  </article>
                )
              )}
            </div>
          )}

          {result.unscheduled.length > 0 && (
            <div className="sf-schedule-unscheduled">
              <AlertCircle size={16} />

              <span>
                {result.unscheduled.length}
                {" "}actividades no pudieron
                programarse por falta de espacio.
              </span>
            </div>
          )}

          <p className="sf-schedule-disclaimer">
            Propuesta de demostración.
            No se guarda ningún bloque
            ni se modifica tu agenda.
          </p>
        </>
      )}
    </section>
  );
}
