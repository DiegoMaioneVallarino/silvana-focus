
import { useEffect, useMemo, useState } from "react";

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

import "./PlannerSchedulePreview.css";
import { useTasksStore } from "../../tasks/tasks.store";
import { useHabitsStore } from "../../habits/habits.store";
import { useAcademyStore } from "../../academy/academy.store";

import {
  CheckCircle2,
  Save,
} from "lucide-react";

import {
  confirmPlannerSchedule,
} from "../planner.confirm";

import type {
  ScheduledSuggestion,
} from "../planner.scheduler";

import {
  timeToMinutes,
  minutesToTime,
} from "../planner.utils";
import {
  getPlannerCandidates,
} from "../planner.candidates";
interface Props {
  date: string;
}
import {
  usePlannerPreferencesStore,
} from "../planner.preferences.store";

export function PlannerSchedulePreview({
  date,
}: Props) {
  const blocks = usePlannerStore(
    (state) => state.blocks
  );
const tasks = useTasksStore(
  (state) => state.tasks
);

const habits = useHabitsStore(
  (state) => state.habits
);

const courses = useAcademyStore(
  (state) => state.courses
);

const progress = useAcademyStore(
  (state) => state.progress
);

const preferences = usePlannerPreferencesStore();
const { days, breakMinutes, maxDailyMinutes } = preferences;

const [year, month, day] = date.split("-").map(Number);
const weekday = new Date(year, month - 1, day).getDay();
const dayPreferences = days[weekday];
const dayStart = dayPreferences?.startTime ?? "08:00";
const dayEnd = dayPreferences?.endTime ?? "20:00";
const dayEnabled = dayPreferences?.enabled ?? false;

const candidates = useMemo(
  () => getPlannerCandidates({
    tasks, habits, courses, progress, blocks, date, preferences,
  }),
  [tasks, habits, courses, progress, blocks, date, preferences]
);

  const [generation, setGeneration] =
    useState(0);

  const validRange =
    dayEnabled &&
    /^\d{2}:\d{2}$/.test(dayStart) &&
    /^\d{2}:\d{2}$/.test(dayEnd) &&
    dayStart < dayEnd;
const [selectedIds, setSelectedIds] =
  useState<string[]>([]);

const [editedTimes, setEditedTimes] =
  useState<Record<string, string>>({});

const [confirmationError, setConfirmationError] =
  useState("");

const [confirmationSuccess, setConfirmationSuccess] =
  useState("");

  
  const result = useMemo(() => {
    if (!validRange) return null;

    return generatePlannerSchedule(
  blocks,
  candidates,
  {
    date,
    dayStart,
    dayEnd,
    minimumBreakMinutes: breakMinutes,
    maxDailyMinutes,
  }
);
  }, [
    blocks,
    candidates,
    date,
    dayStart,
    dayEnd,
    breakMinutes,
    maxDailyMinutes,
    dayEnabled,
    generation,
    validRange,
  ]);
useEffect(() => {
  setSelectedIds([]);
  setEditedTimes({});
  setConfirmationError("");
}, [result]);


const selectedSuggestions: ScheduledSuggestion[] =
  (result?.scheduled ?? [])
    .filter((suggestion) =>
      selectedIds.includes(
        suggestion.candidate.id
      )
    )
    .map((suggestion) => {
      const startTime =
        editedTimes[suggestion.candidate.id] ??
        suggestion.startTime;

      const startMinutes =
        timeToMinutes(startTime);

      const endTime =
        Number.isFinite(startMinutes)
          ? minutesToTime(
              startMinutes +
              suggestion.durationMinutes
            )
          : suggestion.endTime;

      return {
        ...suggestion,
        startTime,
        endTime,
      };
    });


const handleConfirmSchedule = () => {
  setConfirmationError("");
  setConfirmationSuccess("");

  const confirmation =
    confirmPlannerSchedule(
      selectedSuggestions
    );

  if (!confirmation.success) {
    setConfirmationError(
      confirmation.error ??
      "No se pudo guardar la agenda."
    );
    return;
  }

  setConfirmationSuccess(
    `${confirmation.createdBlockIds.length} ` +
    "actividades añadidas al Planner."
  );

  setSelectedIds([]);
  setEditedTimes({});
};
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
          onClick={() => {
            setConfirmationError("");
            setConfirmationSuccess("");
            setGeneration((value) => value + 1);
          }}
        >
          <RefreshCw size={15} />
          Generar
        </button>
      </header>

      <div className="sf-schedule-stats">
        <span>Jornada: {dayStart} – {dayEnd}</span>
        <span>Descanso: {breakMinutes} min</span>
        <span>Carga máxima: {maxDailyMinutes} min</span>
      </div>

      {!result ? (
        <p className="sf-schedule-error">
          <AlertCircle size={15} />
          {!dayEnabled
            ? "Este día está desactivado en tus preferencias."
            : "Configura un horario válido para este día."}
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
              No encontramos espacio para las actividades propuestas.
            </p>
          ) : (
            <>
              <div className="sf-schedule-list">
  {result.scheduled.map((suggestion) => {
    const id = suggestion.candidate.id;

    const selected =
      selectedIds.includes(id);

    const startTime =
      editedTimes[id] ??
      suggestion.startTime;

    return (
      <article
        key={id}
        className={`sf-schedule-item ${
          selected ? "selected" : ""
        }`}
      >
        <label className="sf-schedule-select">
          <input
            type="checkbox"
            checked={selected}
            onChange={(event) => {
              setSelectedIds((current) =>
                event.target.checked
                  ? [...current, id]
                  : current.filter(
                      (item) => item !== id
                    )
              );

              setConfirmationError("");
              setConfirmationSuccess("");
            }}
          />
        </label>

        <div className="sf-schedule-info">
          <strong>
            {suggestion.candidate.title}
          </strong>

          <span>
            {suggestion.durationMinutes} min
            {" · "}
            {suggestion.candidate.priority}
          </span>

          <div className="sf-schedule-edit-time">
            <Clock3 size={14} />

            <input
              type="time"
              value={startTime}
              onChange={(event) => {
                setEditedTimes((current) => ({
                  ...current,
                  [id]: event.target.value,
                }));

                setConfirmationError("");
                setConfirmationSuccess("");
              }}
            />

            <span>
              Duración:
              {" "}
              {suggestion.durationMinutes} min
            </span>
          </div>
        </div>

        <span className="sf-schedule-score">
          {suggestion.candidate.score} pts
        </span>
      </article>
    );
  })}
</div>

    <div className="sf-schedule-confirmation">
      <div>
        <strong>
          {selectedIds.length} actividades seleccionadas
        </strong>
        <span>Revisa los horarios antes de guardar.</span>
      </div>

      <div className="sf-schedule-confirmation-actions">
        <button
          type="button"
          className="sf-schedule-select-all"
          onClick={() =>
            setSelectedIds(
              result.scheduled.map(
                (item) => item.candidate.id
              )
            )
          }
        >
          Seleccionar todas
        </button>

        <button
          type="button"
          className="sf-schedule-save"
          disabled={selectedIds.length === 0}
          onClick={handleConfirmSchedule}
        >
          <Save size={15} />
          Confirmar horarios
        </button>
      </div>
    </div>

    {confirmationError && (
      <div className="sf-schedule-confirm-error">
        <AlertCircle size={16} />
        {confirmationError}
      </div>
    )}

    {confirmationSuccess && (
      <div className="sf-schedule-confirm-success">
        <CheckCircle2 size={16} />
        {confirmationSuccess}
      </div>
    )}
            </>
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

         {candidates.length === 0 && (
  <div className="sf-schedule-empty">
    No tienes actividades pendientes
    elegibles para planificar este día.
  </div>
)}
        </>
      )}
    </section>
  );
}
