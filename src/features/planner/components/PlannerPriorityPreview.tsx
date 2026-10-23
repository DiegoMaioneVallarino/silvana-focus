
import { useMemo } from "react";

import {
  ArrowUpDown,
  Clock3,
  Sparkles,
} from "lucide-react";

import {
  rankPlannerCandidates,
} from "../planner.priorities";

import type {
  PlannerCandidate,
} from "../planner.priorities";

import "./PlannerPriorityPreview.css";

interface Props {
  date: string;
}

const sampleCandidates: PlannerCandidate[] = [
  {
    id: "sample-task-1",
    title: "Terminar trabajo importante",
    source: "task",
    sourceId: null,
    priority: "high",
    durationMinutes: 90,
    goalImportance: 4,
  },
  {
    id: "sample-habit-1",
    title: "Ejercicio diario",
    source: "habit",
    sourceId: null,
    priority: "medium",
    durationMinutes: 30,
    goalImportance: 3,
  },
  {
    id: "sample-academy-1",
    title: "Estudiar programación",
    source: "academy",
    sourceId: null,
    priority: "medium",
    durationMinutes: 45,
    goalImportance: 5,
  },
  {
    id: "sample-task-2",
    title: "Organizar archivos",
    source: "task",
    sourceId: null,
    priority: "low",
    durationMinutes: 15,
  },
];

const sourceLabels = {
  task: "Tarea",
  habit: "Hábito",
  academy: "Academia",
  calendar: "Calendario",
  manual: "Personal",
};

export function PlannerPriorityPreview({
  date,
}: Props) {
  const ranked = useMemo(
    () =>
      rankPlannerCandidates(
        sampleCandidates,
        { date }
      ),
    [date]
  );

  return (
    <section className="sf-card sf-planner-priority-preview">
      <header className="sf-planner-priority-header">
        <div>
          <span className="sf-planner-priority-eyebrow">
            <Sparkles size={14} />
            SMART PLANNER
          </span>

          <h2>Motor de prioridades</h2>

          <p>
            Así organiza Silvana las actividades
            según su importancia.
          </p>
        </div>

        <ArrowUpDown
          size={21}
          color="#873cff"
        />
      </header>

      <div className="sf-planner-priority-list">
        {ranked.map((candidate, index) => (
          <article
            key={candidate.id}
            className="sf-planner-priority-item"
          >
            <span className="sf-planner-priority-position">
              {index + 1}
            </span>

            <div className="sf-planner-priority-info">
              <strong>
                {candidate.title}
              </strong>

              <div className="sf-planner-priority-meta">
                <span>
                  {sourceLabels[candidate.source]}
                </span>

                <span>
                  <Clock3 size={12} />
                  {candidate.durationMinutes} min
                </span>
              </div>

              <div className="sf-planner-priority-reasons">
                {candidate.reasons.map(
                  (reason) => (
                    <small key={reason}>
                      {reason}
                    </small>
                  )
                )}
              </div>
            </div>

            <div className="sf-planner-priority-score">
              <strong>
                {candidate.score}
              </strong>
              <small>puntos</small>
            </div>
          </article>
        ))}
      </div>

      <p className="sf-planner-priority-note">
        Vista de prueba con actividades de ejemplo.
        Todavía no modifica tu agenda.
      </p>
    </section>
  );
}
