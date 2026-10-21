
import { useState } from "react";
import { Check, Plus, Link2, X } from "lucide-react";

import { useTasksStore } from "../../tasks/tasks.store";
import { getProjectTasks } from "../projects.utils";

interface ProjectTasksProps {
  projectId: string;
  goalId: string | null;
}

export function ProjectTasks({
  projectId,
  goalId,
}: ProjectTasksProps) {
  const tasks = useTasksStore((state) => state.tasks);
  const addTask = useTasksStore((state) => state.addTask);
  const updateStatus = useTasksStore(
    (state) => state.updateStatus
  );
  const setTaskProject = useTasksStore(
    (state) => state.setTaskProject
  );

  const [title, setTitle] = useState("");
  const [existingTaskId, setExistingTaskId] = useState("");

  const projectTasks = getProjectTasks(tasks, projectId);

  const availableTasks = tasks.filter(
    (task) => !task.projectId
  );

  function handleAddTask(event: React.FormEvent) {
    event.preventDefault();

    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: "",
      priority: "medium",
      dueDate: null,
      goalId,
      projectId,
    });

    setTitle("");
  }

  function handleLinkTask() {
    if (!existingTaskId) return;

    setTaskProject(existingTaskId, projectId);
    setExistingTaskId("");
  }

  return (
    <section className="sf-project-tasks">
      <h3>Tareas del proyecto</h3>

      <form
        className="sf-project-add-task"
        onSubmit={handleAddTask}
      >
        <input
          placeholder="Nueva tarea..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        <button type="submit">
          <Plus size={17} />
          Añadir
        </button>
      </form>

      {availableTasks.length > 0 && (
        <div className="sf-project-link-task">
          <select
            value={existingTaskId}
            onChange={(event) =>
              setExistingTaskId(event.target.value)
            }
          >
            <option value="">Vincular tarea existente...</option>
            {availableTasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={!existingTaskId}
            onClick={handleLinkTask}
            title="Vincular tarea"
          >
            <Link2 size={17} />
          </button>
        </div>
      )}

      <div className="sf-project-task-list">
        {projectTasks.length === 0 && (
          <p className="sf-muted">
            Este proyecto todavía no tiene tareas.
          </p>
        )}

        {projectTasks.map((task) => (
          <div
            key={task.id}
            className="sf-project-task-item"
          >
            <button
              type="button"
              className={
                task.status === "completed"
                  ? "is-completed"
                  : ""
              }
              title="Alternar tarea completada"
              onClick={() =>
                updateStatus(
                  task.id,
                  task.status === "completed"
                    ? "pending"
                    : "completed"
                )
              }
            >
              <Check size={15} />
            </button>

            <span
              className={
                task.status === "completed"
                  ? "completed"
                  : ""
              }
            >
              {task.title}
            </span>

            <button
              type="button"
              title="Quitar del proyecto"
              onClick={() =>
                setTaskProject(task.id, null)
              }
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
