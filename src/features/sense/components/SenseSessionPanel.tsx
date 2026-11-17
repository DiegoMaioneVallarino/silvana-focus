
import { useState } from "react";
import {
  Play,
  Pause,
  CheckCircle2,
  Coffee,
  RotateCcw,
  XCircle,
} from "lucide-react";

import type {
  PlannerBlock,
} from "../../planner/planner.types";

import {
  createSenseConstraints,
} from "../sense.constraints";

import {
  useSenseStore,
} from "../sense.store";

import type {
  SensePauseReason,
  SenseSessionReport,
} from "../sense.types";

import "./SenseSessionPanel.css";

interface Props {
  block: PlannerBlock;
}

const pauseReasons: {
  value: SensePauseReason;
  label: string;
}[] = [
  { value: "rest", label: "Descanso" },
  { value: "food", label: "Comida" },
  { value: "family", label: "Familia" },
  {
    value: "unexpected_work",
    label: "Imprevisto",
  },
  {
    value: "distraction",
    label: "Distracción",
  },
  {
    value: "unspecified",
    label: "Sin especificar",
  },
];

export function SenseSessionPanel({
  block,
}: Props) {
  const {
    sessions,
    activeSessionId,
    startSession,
    pauseSession,
    resumeSession,
    finishSession,
    abandonSession,
  } = useSenseStore();

  const [pauseReason, setPauseReason] =
    useState<SensePauseReason>("unspecified");

  const [outcome, setOutcome] =
    useState<
      SenseSessionReport["outcome"]
    >("partial");

  const [showReport, setShowReport] =
    useState(false);

  const [notes, setNotes] = useState("");

  const session = sessions.find(
    (item) => item.id === activeSessionId
  );

  const belongsToBlock =
    session?.blockId === block.id;

  const canStart =
    !activeSessionId &&
    block.status === "planned";

  const handleStart = () => {
    const started = startSession({
      blockId: block.id,
      title: block.title,
      constraints:
        createSenseConstraints(
          "flexible",
          {
            preferredSessionMinutes:
              block.durationMinutes,
          }
        ),
    });

    if (started) {
      setShowReport(false);
    }
  };

  const handleFinish = () => {
    const success = finishSession(
      outcome,
      null,
      notes
    );

    if (success) {
      setShowReport(false);
      setNotes("");
    }
  };

  return (
    <section className="sf-card sf-sense-panel">
      <header className="sf-sense-header">
        <div>
          <span className="sf-sense-eyebrow">
            SILVANA SENSE
          </span>
          <h3>Seguimiento flexible</h3>
        </div>
        <span className="sf-sense-indicator">
          {belongsToBlock
            ? session?.status === "active"
              ? "En actividad"
              : "En pausa"
            : "Disponible"}
        </span>
      </header>

      <div className="sf-sense-activity">
        <strong>{block.title}</strong>
        <span>
          Duración prevista:
          {" "}
          {block.durationMinutes} min
        </span>
      </div>

      {belongsToBlock && session ? (
        <>
          {session.status === "active" ? (
            <div className="sf-sense-actions">
              <button
                type="button"
                onClick={() =>
                  pauseSession(pauseReason)
                }
              >
                <Pause size={16} />
                Pausar
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowReport(true)
                }
              >
                <CheckCircle2 size={16} />
                Terminar
              </button>
            </div>
          ) : (
            <div className="sf-sense-actions">
              <button
                type="button"
                onClick={resumeSession}
              >
                <RotateCcw size={16} />
                Retomar
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowReport(true)
                }
              >
                <CheckCircle2 size={16} />
                Terminar
              </button>
            </div>
          )}

          <label className="sf-sense-field">
            <Coffee size={15} />
            Motivo de pausa (opcional)
            <select
  value={pauseReason}
  onChange={(event) => {
    const reason = event.currentTarget.value as SensePauseReason;
    setPauseReason(reason);
  }}
>
              {pauseReasons.map((reason) => (
                <option
                  key={reason.value}
                  value={reason.value}
                >
                  {reason.label}
                </option>
              ))}
            </select>
          </label>

          {showReport && (
            <div className="sf-sense-report">
              <h4>¿Cómo te fue?</h4>

              <select
                value={outcome}
                onChange={(event) => {
  const value = event.currentTarget.value as SenseSessionReport["outcome"];
  setOutcome(value);
}}
              >
                <option value="completed">
                  Completé mi objetivo
                </option>
                <option value="partial">
                  Avancé parcialmente
                </option>
                <option value="blocked">
                  Tuve dificultades
                </option>
                <option value="not_started">
                  No pude avanzar
                </option>
              </select>

              <textarea
                placeholder="¿Alguna dificultad? (opcional)"
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                rows={2}
              />

              <div className="sf-sense-actions">
                <button
                  type="button"
                  onClick={handleFinish}
                >
                  Guardar resultado
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowReport(false)
                  }
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            className="sf-sense-abandon"
            onClick={abandonSession}
          >
            <XCircle size={14} />
            Cerrar sin completar
          </button>
        </>
      ) : (
        <>
          {canStart ? (
            <button
              type="button"
              className="sf-sense-start"
              onClick={handleStart}
            >
              <Play size={16} />
              Comenzar actividad
            </button>
          ) : (
            <p className="sf-muted">
              {activeSessionId
                ? "Ya tienes otra sesión en curso."
                : "Este bloque no está pendiente."}
            </p>
          )}
        </>
      )}
    </section>
  );
}
