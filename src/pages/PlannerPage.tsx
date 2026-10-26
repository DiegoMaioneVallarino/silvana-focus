
import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  Check,
  RotateCcw,
  SkipForward,
  Trash2,
  Pencil,
  AlertCircle,
} from "lucide-react";
import { PlannerPriorityPreview } from "../features/planner/components/PlannerPriorityPreview";
import { PlannerSchedulePreview } from "../features/planner/components/PlannerSchedulePreview";

import { usePlannerStore } from "../features/planner/planner.store";
import {
  getDayBlocks,
  getDaySummary,
} from "../features/planner/planner.utils";

import type {
  CreatePlannerBlockInput,
  PlannerBlock,
  PlannerPriority,
  PlannerSource,
} from "../features/planner/planner.types";

import { PlannerAvailability } from "../features/planner/components/PlannerAvailability";

import "./PlannerPage.css";

import { PlannerPreferencesPanel } from "../features/planner/components/PlannerPreferencesPanel";

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function shiftDate(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const value = new Date(year, month - 1, day);
  value.setDate(value.getDate() + days);
  return localDateKey(value);
}

function formatDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} h`;

  return `${hours} h ${rest} min`;
}

const sourceLabels: Record<PlannerSource, string> = {
  task: "Tarea",
  habit: "Hábito",
  calendar: "Calendario",
  academy: "Academia",
  manual: "Personal",
};

const sourceColors: Record<PlannerSource, string> = {
  task: "#ff5a12",
  habit: "#20b879",
  calendar: "#3d73ff",
  academy: "#873cff",
  manual: "#8193b5",
};

const initialForm: CreatePlannerBlockInput = {
  title: "",
  date: localDateKey(new Date()),
  startTime: "09:00",
  durationMinutes: 30,
  source: "manual",
  priority: "medium",
};

export function PlannerPage() {
  const blocks = usePlannerStore((state) => state.blocks);
  const addBlock = usePlannerStore((state) => state.addBlock);
  const updateBlock = usePlannerStore((state) => state.updateBlock);
  const removeBlock = usePlannerStore((state) => state.removeBlock);
  const setBlockStatus = usePlannerStore(
    (state) => state.setBlockStatus
  );

  const [selectedDate, setSelectedDate] = useState(
    localDateKey(new Date())
  );

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState<CreatePlannerBlockInput>(
    initialForm
  );

  const dayBlocks = getDayBlocks(blocks, selectedDate);
  const summary = getDaySummary(blocks, selectedDate);

  const openCreate = () => {
    setEditingId(null);
    setError("");
    setForm({
      ...initialForm,
      date: selectedDate,
    });
    setFormOpen(true);
  };

  const openEdit = (block: PlannerBlock) => {
    setEditingId(block.id);
    setError("");
    setForm({
      title: block.title,
      date: block.date,
      startTime: block.startTime,
      durationMinutes: block.durationMinutes,
      source: block.source,
      sourceId: block.sourceId,
      priority: block.priority,
    });
    setFormOpen(true);
  };

  const saveBlock = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = editingId
      ? updateBlock(editingId, form)
      : addBlock(form);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSelectedDate(form.date);
    setFormOpen(false);
    setEditingId(null);
    setError("");
  };

  return (
    <div className="sf-planner-page">
      <header className="sf-planner-heading">
        <div>
          <div className="sf-planner-eyebrow">
            <CalendarDays size={15} />
            SMART DAILY PLANNER
          </div>
          <h1>Mi plan diario</h1>
          <p>
            Organiza tu tiempo, prioriza tus actividades y
            construye días más productivos.
          </p>
        </div>

        <button
          className="sf-planner-primary-button"
          onClick={openCreate}
        >
          <Plus size={17} />
          Nuevo bloque
        </button>
      </header>

      <div className="sf-planner-datebar sf-card">
        <div className="sf-planner-date-navigation">
          <button
            aria-label="Día anterior"
            onClick={() =>
              setSelectedDate(shiftDate(selectedDate, -1))
            }
          >
            <ChevronLeft size={19} />
          </button>

          <div>
            <strong>{formatDate(selectedDate)}</strong>
            <span>
              {selectedDate === localDateKey(new Date())
                ? "Hoy"
                : "Planificación diaria"}
            </span>
          </div>

          <button
            aria-label="Día siguiente"
            onClick={() =>
              setSelectedDate(shiftDate(selectedDate, 1))
            }
          >
            <ChevronRight size={19} />
          </button>
        </div>

        <button
          className="sf-planner-today-button"
          onClick={() =>
            setSelectedDate(localDateKey(new Date()))
          }
        >
          Ir a hoy
        </button>
      </div>

      <section className="sf-planner-summary">
        <div className="sf-card sf-planner-summary-card">
          <span>Tiempo planificado</span>
          <strong>{formatMinutes(summary.plannedMinutes)}</strong>
          <small>{summary.totalBlocks} bloques</small>
        </div>

        <div className="sf-card sf-planner-summary-card">
          <span>Tiempo completado</span>
          <strong>{formatMinutes(summary.completedMinutes)}</strong>
          <small>{summary.completedBlocks} terminados</small>
        </div>

        <div className="sf-card sf-planner-summary-card">
          <span>Progreso del día</span>
          <strong>{summary.completionPercent}%</strong>
          <div className="sf-planner-progress-track">
            <div
              style={{
                width: `${summary.completionPercent}%`,
              }}
            />
          </div>
        </div>
      </section>
      <PlannerAvailability date={selectedDate} />
      <PlannerPriorityPreview date={selectedDate} />
      <PlannerPreferencesPanel />
      <PlannerSchedulePreview date={selectedDate} />

      <section className="sf-card sf-planner-timeline">
        <div className="sf-planner-section-heading">
          <div>
            <h2>Tu agenda</h2>
            <p>Actividades ordenadas por horario</p>
          </div>

          <span>{dayBlocks.length} actividades</span>
        </div>

        {dayBlocks.length === 0 ? (
          <div className="sf-planner-empty">
            <CalendarDays size={35} />
            <h3>Tu día está por organizarse</h3>
            <p>
              Añade un bloque para comenzar a planificar
              tus actividades.
            </p>
            <button onClick={openCreate}>
              <Plus size={16} />
              Crear primer bloque
            </button>
          </div>
        ) : (
          <div className="sf-planner-blocks">
            {dayBlocks.map((block) => (
              <article
                className={`sf-planner-block ${block.status}`}
                key={block.id}
                style={{
                  borderLeftColor: sourceColors[block.source],
                }}
              >
                <div className="sf-planner-block-time">
                  <strong>{block.startTime}</strong>
                  <span>
                    <Clock3 size={12} />
                    {formatMinutes(block.durationMinutes)}
                  </span>
                </div>

                <div className="sf-planner-block-content">
                  <div className="sf-planner-block-meta">
                    <span
                      className="sf-planner-source"
                      style={{
                        color: sourceColors[block.source],
                        backgroundColor: `${sourceColors[block.source]}14`,
                      }}
                    >
                      {sourceLabels[block.source]}
                    </span>

                    <span className={`sf-planner-priority ${block.priority}`}>
                      {block.priority === "high"
                        ? "Alta prioridad"
                        : block.priority === "medium"
                          ? "Media"
                          : "Baja"}
                    </span>
                  </div>

                  <h3>{block.title}</h3>

                  <span className="sf-planner-block-status">
                    {block.status === "completed"
                      ? "Completado"
                      : block.status === "skipped"
                        ? "Omitido"
                        : "Pendiente"}
                  </span>
                </div>

                <div className="sf-planner-block-actions">
  {block.source !== "calendar" && (
    <>
      {block.status !== "completed" && (
        <button
          title="Completar"
          aria-label={`Completar ${block.title}`}
          onClick={() =>
            setBlockStatus(block.id, "completed")
          }
        >
          <Check size={16} />
        </button>
      )}

      {block.status !== "skipped" && (
        <button
          title="Omitir"
          aria-label={`Omitir ${block.title}`}
          onClick={() =>
            setBlockStatus(block.id, "skipped")
          }
        >
          <SkipForward size={16} />
        </button>
      )}

      {block.status !== "planned" && (
        <button
          title="Volver a pendiente"
          aria-label={`Reactivar ${block.title}`}
          onClick={() =>
            setBlockStatus(block.id, "planned")
          }
        >
          <RotateCcw size={16} />
        </button>
      )}

      <button
        title="Editar"
        aria-label={`Editar ${block.title}`}
        onClick={() => openEdit(block)}
      >
        <Pencil size={16} />
      </button>

      <button
        className="danger"
        title="Eliminar"
        aria-label={`Eliminar ${block.title}`}
        onClick={() => {
          if (
            window.confirm(
              `¿Eliminar "${block.title}" del plan?`
            )
          ) {
            removeBlock(block.id);
          }
        }}
      >
        <Trash2 size={16} />
      </button>
    </>
  )}
</div>
              </article>
            ))}
          </div>
        )}
      </section>

      {formOpen && (
        <div
          className="sf-planner-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setFormOpen(false);
            }
          }}
        >
          <form
            className="sf-planner-modal"
            onSubmit={saveBlock}
          >
            <div className="sf-planner-modal-heading">
              <h2>
                {editingId ? "Editar bloque" : "Nuevo bloque"}
              </h2>

              <button
                type="button"
                onClick={() => setFormOpen(false)}
              >
                ✕
              </button>
            </div>

            <label>
              Actividad
              <input
                required
                autoFocus
                placeholder="¿Qué vas a hacer?"
                value={form.title}
                onChange={(event) =>
                  setForm({
                    ...form,
                    title: event.target.value,
                  })
                }
              />
            </label>

            <div className="sf-planner-form-row">
              <label>
                Fecha
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      date: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Hora
                <input
                  type="time"
                  required
                  value={form.startTime}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      startTime: event.target.value,
                    })
                  }
                />
              </label>
            </div>

            <div className="sf-planner-form-row">
              <label>
                Duración (min)
                <input
                  type="number"
                  min={1}
                  max={1440}
                  required
                  value={form.durationMinutes}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      durationMinutes: Number(event.target.value),
                    })
                  }
                />
              </label>

              <label>
                Prioridad
                <select
                  value={form.priority}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      priority: event.target.value as PlannerPriority,
                    })
                  }
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </label>
            </div>

            <label>
              Categoría
              <select
                value={form.source}
                onChange={(event) =>
                  setForm({
                    ...form,
                    source: event.target.value as PlannerSource,
                    sourceId: null,
                  })
                }
              >
               <option value="manual">Personal</option>
              </select>
            </label>

            {error && (
              <div className="sf-planner-error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="sf-planner-modal-actions">
              <button
                type="button"
                className="sf-planner-cancel"
                onClick={() => setFormOpen(false)}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="sf-planner-primary-button"
              >
                {editingId ? "Guardar cambios" : "Crear bloque"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
