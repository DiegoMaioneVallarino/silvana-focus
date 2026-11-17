
import {
  useEffect,
  useState,
} from "react";

import {
  Sparkles,
  X,
  Minus,
  Play,
  Pause,
  Check,
  Plus,
  RotateCcw,
} from "lucide-react";

import { useSenseStore } from "../sense.store";
import { getActivityProgress } from "../sense.engine";

import type {
  SenseSessionReport,
} from "../sense.types";

import "./SenseBubble.css";

import type { ChangeEvent } from "react";

export function SenseBubble() {
  const {
    activities,
    sessions,
    activeSessionId,
    recovery,
    pauseSession,
    resumeSession,
    finishSession,
    startActivity,
    startSpontaneous,
    recoverSession,
    heartbeat,
    checkRecovery,
  } = useSenseStore();

  const [expanded, setExpanded] =
    useState(false);

  const [showCreate, setShowCreate] =
    useState(false);

  const [showReport, setShowReport] =
    useState(false);

  const [title, setTitle] = useState("");

  const [outcome, setOutcome] =
    useState<
      SenseSessionReport["outcome"]
    >("partial");


const handleOutcomeChange = (
  event: React.ChangeEvent<HTMLSelectElement>
) => {
  const selected = event.currentTarget.value;

  if (
    selected === "completed" ||
    selected === "partial" ||
    selected === "blocked" ||
    selected === "not_started"
  ) {
    setOutcome(selected);
  }
};

  const [tick, setTick] = useState(
    Date.now()
  );

  useEffect(() => {
    checkRecovery();

    const interval = window.setInterval(() => {
      heartbeat();
      setTick(Date.now());
    }, 15000);

    return () => {
      window.clearInterval(interval);
    };
  }, [checkRecovery, heartbeat]);

  const session = sessions.find(
    (item) => item.id === activeSessionId
  );

  const activity = activities.find(
    (item) =>
      item.id === session?.activityId
  );

  const progress = activity
    ? getActivityProgress(
        activity,
        sessions,
        new Date(tick).toISOString()
      )
    : null;

  const minutes = progress
    ? Math.floor(progress.effectiveMinutes)
    : 0;

  const handleFinish = () => {
    if (finishSession(outcome)) {
      setShowReport(false);
      setExpanded(false);
    }
  };

  const handleCreate = () => {
    if (startSpontaneous(title)) {
      setTitle("");
      setShowCreate(false);
      setExpanded(true);
    }
  };

  return (
    <div className="sf-sense-bubble-root">
      {expanded && (
        <div className="sf-sense-bubble-panel">
          <header className="sf-sense-bubble-header">
            <div>
              <small>SILVANA SENSE</small>
              <strong>
                {session?.title ??
                  "¿Qué hacemos ahora?"}
              </strong>
            </div>

            <button
              type="button"
              onClick={() =>
                setExpanded(false)
              }
              aria-label="Minimizar"
            >
              <Minus size={17} />
            </button>
          </header>

          {recovery ? (
            <div className="sf-sense-bubble-content">
              <p>
                La sesión quedó abierta.
                El tiempo posterior a la
                última señal no se contará.
              </p>

              <button
                type="button"
                onClick={() =>
                  recoverSession(true)
                }
              >
                <RotateCcw size={15} />
                Retomar desde ahora
              </button>

              <button
                type="button"
                className="secondary"
                onClick={() =>
                  recoverSession(false)
                }
              >
                Dejar en pausa
              </button>
            </div>
          ) : session ? (
            <div className="sf-sense-bubble-content">
              <div className="sf-sense-bubble-metric">
                <strong>{minutes} min</strong>
                <span>
                  Tiempo activo declarado
                  acumulado
                </span>
              </div>

              <p>
                {session.status === "active"
                  ? "Actividad en curso"
                  : "Sesión en pausa"}
              </p>

              {progress?.remainingMinutes != null && (
                <p>
                  Restante estimado:{" "}
                  {Math.ceil(
                    progress.remainingMinutes
                  )}{" "}
                  min
                </p>
              )}

              {session.status === "active" ? (
                <button
                  type="button"
                  onClick={() =>
                    pauseSession("unspecified")
                  }
                >
                  <Pause size={15} />
                  Pausar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resumeSession}
                >
                  <Play size={15} />
                  Retomar
                </button>
              )}

              {!showReport ? (
                <button
                  type="button"
                  className="secondary"
                  onClick={() =>
                    setShowReport(true)
                  }
                >
                  <Check size={15} />
                  Terminar sesión
                </button>
              ) : (
                <div className="sf-sense-bubble-report">
                  <label>
                    ¿Cómo te fue?
                    <select
  value={outcome}
  onChange={handleOutcomeChange}
>
  <option value="completed">
    Completé el objetivo
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
                  </label>

                  <button
                    type="button"
                    onClick={handleFinish}
                  >
                    Guardar resultado
                  </button>

                  <button
                    type="button"
                    className="secondary"
                    onClick={() =>
                      setShowReport(false)
                    }
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="sf-sense-bubble-content">
              <p>
                Inicia una actividad sin
                modificar tu itinerario.
              </p>

              {!showCreate ? (
                <button
                  type="button"
                  onClick={() =>
                    setShowCreate(true)
                  }
                >
                  <Plus size={15} />
                  Actividad espontánea
                </button>
              ) : (
                <div className="sf-sense-bubble-report">
                  <input
                    value={title}
                    onChange={(event) =>
                      setTitle(
                        event.target.value
                      )
                    }
                    placeholder="¿Qué vas a hacer?"
                    maxLength={100}
                  />

                  <button
                    type="button"
                    disabled={!title.trim()}
                    onClick={handleCreate}
                  >
                    <Play size={15} />
                    Comenzar
                  </button>

                  <button
                    type="button"
                    className="secondary"
                    onClick={() =>
                      setShowCreate(false)
                    }
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {activities.length > 0 && (
                <div className="sf-sense-bubble-recent">
                  <small>
                    Retomar una actividad
                  </small>

                  {activities
                    .slice(-3)
                    .reverse()
                    .map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        className="secondary"
                        onClick={() => {
                          if (
                            startActivity(item.id)
                          ) {
                            setExpanded(true);
                          }
                        }}
                      >
                        <RotateCcw size={14} />
                        {item.title}
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className="sf-sense-bubble-trigger"
        onClick={() =>
          setExpanded((value) => !value)
        }
        aria-label={
          expanded
            ? "Cerrar Silvana Sense"
            : "Abrir Silvana Sense"
        }
      >
        {expanded ? (
          <X size={23} />
        ) : (
          <Sparkles size={23} />
        )}

        {session && (
          <span className="sf-sense-bubble-dot" />
        )}
      </button>
    </div>
  );
}
