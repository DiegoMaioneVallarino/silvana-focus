
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGoalsStore } from "../../goals/goals.store";
import { useProjectsStore } from "../projects.store";

import type { Project } from "../projects.types";

interface ProjectFormProps {
  project?: Project;
}

const colors = [
  "#873cff",
  "#ff5a12",
  "#3d73ff",
  "#20b879",
  "#ec4899",
  "#64748b",
];

export function ProjectForm({ project }: ProjectFormProps) {
  const navigate = useNavigate();

  const goals = useGoalsStore((state) => state.goals);
  const addProject = useProjectsStore(
    (state) => state.addProject
  );
  const updateProject = useProjectsStore(
    (state) => state.updateProject
  );

  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(
    project?.description ?? ""
  );
  const [color, setColor] = useState(
    project?.color ?? "#873cff"
  );
  const [dueDate, setDueDate] = useState(
    project?.dueDate ?? ""
  );
  const [goalId, setGoalId] = useState(
    project?.goalId ?? ""
  );

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim()) return;

    const input = {
      name: name.trim(),
      description: description.trim(),
      color,
      dueDate: dueDate || null,
      goalId: goalId || null,
    };

    if (project) {
      updateProject(project.id, input);
    } else {
      const id = addProject(input);
      navigate(`/projects/${id}`);
    }
  }

  return (
    <form
      className="sf-project-form"
      onSubmit={handleSubmit}
    >
      <label>
        Nombre del proyecto
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ej. Crear mi portafolio"
          required
        />
      </label>

      <label>
        Descripción
        <textarea
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder="¿Qué quieres construir?"
          rows={3}
        />
      </label>

      <label>
        Color
        <div className="sf-project-color-options">
          {colors.map((option) => (
            <button
              key={option}
              type="button"
              aria-label={`Seleccionar color ${option}`}
              aria-pressed={color === option}
              className={
                color === option ? "selected" : ""
              }
              style={{ background: option }}
              onClick={() => setColor(option)}
            />
          ))}
        </div>
      </label>

      <label>
        Fecha límite
        <input
          type="date"
          value={dueDate}
          onChange={(event) =>
            setDueDate(event.target.value)
          }
        />
      </label>

      <label>
        Objetivo relacionado
        <select
          value={goalId}
          onChange={(event) => setGoalId(event.target.value)}
        >
          <option value="">Sin objetivo</option>
          {goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.title}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" className="sf-project-submit">
        {project ? "Guardar cambios" : "Crear proyecto"}
      </button>
    </form>
  );
}
