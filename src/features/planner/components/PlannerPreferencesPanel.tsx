
import { useState } from "react";
import {
  RotateCcw,
  Settings2,
} from "lucide-react";

import {
  usePlannerPreferencesStore,
} from "../planner.preferences.store";

import "./PlannerPreferencesPanel.css";

const weekdays = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

type NumericPreference =
  | "breakMinutes"
  | "taskDurationMinutes"
  | "habitDurationMinutes"
  | "academyDurationMinutes"
  | "maxDailyMinutes";

const numericFields: {
  key: NumericPreference;
  label: string;
  min: number;
  max: number;
}[] = [
  {
    key: "breakMinutes",
    label: "Descanso entre actividades",
    min: 0,
    max: 60,
  },
  {
    key: "taskDurationMinutes",
    label: "Duración de tareas",
    min: 5,
    max: 240,
  },
  {
    key: "habitDurationMinutes",
    label: "Duración de hábitos",
    min: 5,
    max: 240,
  },
  {
    key: "academyDurationMinutes",
    label: "Duración de Academia",
    min: 5,
    max: 240,
  },
  {
    key: "maxDailyMinutes",
    label: "Carga diaria máxima",
    min: 30,
    max: 960,
  },
];

export function PlannerPreferencesPanel() {
  const days = usePlannerPreferencesStore(
    (state) => state.days
  );

  const preferences =
    usePlannerPreferencesStore();

  const updateDay =
    usePlannerPreferencesStore(
      (state) => state.updateDay
    );

  const updatePreferences =
    usePlannerPreferencesStore(
      (state) => state.updatePreferences
    );

  const resetPreferences =
    usePlannerPreferencesStore(
      (state) => state.resetPreferences
    );

  const [expanded, setExpanded] =
    useState(false);

  return (
    <section className="sf-card sf-planner-preferences">
      <header className="sf-planner-preferences-header">
        <div>
          <span className="sf-planner-preferences-eyebrow">
            <Settings2 size={14} />
            CONFIGURACIÓN
          </span>

          <h2>Preferencias de planificación</h2>
          <p>
            Personaliza cuándo y cuánto
            tiempo quieres dedicar a tus actividades.
          </p>
        </div>

        <button
          type="button"
          className="sf-planner-preferences-toggle"
          onClick={() =>
            setExpanded((value) => !value)
          }
        >
          {expanded ? "Ocultar" : "Configurar"}
        </button>
      </header>

      {expanded && (
        <div className="sf-planner-preferences-content">
          <div>
            <h3>Disponibilidad semanal</h3>
            <p className="sf-muted">
              Activa los días en los que
              quieres recibir propuestas.
            </p>

            <div className="sf-planner-preferences-days">
              {weekdays.map((label, weekday) => {
                const day = days[weekday];

                return (
                  <div
                    className="sf-planner-preferences-day"
                    key={weekday}
                  >
                    <label className="sf-planner-preferences-day-name">
                      <input
                        type="checkbox"
                        checked={day.enabled}
                        onChange={(event) =>
                          updateDay(weekday, {
                            enabled:
                              event.target.checked,
                          })
                        }
                      />
                      {label}
                    </label>

                    <input
                      type="time"
                      value={day.startTime}
                      disabled={!day.enabled}
                      onChange={(event) =>
                        updateDay(weekday, {
                          startTime:
                            event.target.value,
                        })
                      }
                    />

                    <span>hasta</span>

                    <input
                      type="time"
                      value={day.endTime}
                      disabled={!day.enabled}
                      onChange={(event) =>
                        updateDay(weekday, {
                          endTime:
                            event.target.value,
                        })
                      }
                    />

                    {day.enabled &&
                      day.startTime >= day.endTime && (
                        <small className="sf-planner-preferences-warning">
                          El inicio debe ser anterior al final.
                        </small>
                      )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3>Duraciones y descansos</h3>

            <div className="sf-planner-preferences-numbers">
              {numericFields.map((field) => (
                <label key={field.key}>
                  <span>{field.label}</span>

                  <div>
                    <input
                      type="number"
                      min={field.min}
                      max={field.max}
                      value={preferences[field.key]}
                      onChange={(event) => {
                        const value =
                          Number(event.target.value);

                        if (!Number.isFinite(value)) {
                          return;
                        }

                        updatePreferences({
                          [field.key]: Math.max(
                            field.min,
                            Math.min(
                              field.max,
                              Math.round(value)
                            )
                          ),
                        });
                      }}
                    />
                    <span>min</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="sf-planner-preferences-reset"
            onClick={() => {
              if (
                window.confirm(
                  "¿Restablecer las preferencias de planificación?"
                )
              ) {
                resetPreferences();
              }
            }}
          >
            <RotateCcw size={14} />
            Restaurar valores predeterminados
          </button>
        </div>
      )}
    </section>
  );
}
