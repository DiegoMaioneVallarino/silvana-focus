
import { useState } from "react";
import {
  Plus,
  Trash2,
  Check,
  Circle,
  Clock3,
} from "lucide-react";
import { TaskScheduleButton } from
  "../../planner/components/TaskScheduleButton";
import { useTasksStore } from "../tasks.store";
import { useGoalsStore } from "../../goals/goals.store";

import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "../tasks.types";

const columns: {
  id: TaskStatus;
  title: string;
}[] = [
  { id: "pending", title: "Pendientes" },
  { id: "in_progress", title: "En progreso" },
  { id: "completed", title: "Completadas" },
];

const priorityLabels: Record<TaskPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

function TaskCard({ task }: { task: Task }) {
  const updateStatus = useTasksStore(
    (state) => state.updateStatus
  );
  const deleteTask = useTasksStore(
    (state) => state.deleteTask
  );
  const addSubtask = useTasksStore(
    (state) => state.addSubtask
  );
  const toggleSubtask = useTasksStore(
    (state) => state.toggleSubtask
  );

  const [subtaskTitle, setSubtaskTitle] = useState("");

  function handleAddSubtask(event: React.FormEvent) {
    event.preventDefault();

    if (!subtaskTitle.trim()) return;

    addSubtask(task.id, subtaskTitle.trim());
    setSubtaskTitle("");
  }

  return (
    <article className="sf-task-card">
      <div className="sf-task-card-top">
        <span className={`sf-task-priority ${task.priority}`}>
          {priorityLabels[task.priority]}
        </span>

        <button
          title="Eliminar tarea"
          onClick={() => deleteTask(task.id)}
        >
          <Trash2 size={15} />
        </button>
      </div>

      <h4>{task.title}</h4>

      {task.description && <p>{task.description}</p>}

      {task.dueDate && (
        <span className="sf-task-date">
          <Clock3 size={13} />
          {task.dueDate}
        </span>
      )}

      <div className="sf-task-subtasks">
        {task.subtasks.map((subtask) => (
          <button
            key={subtask.id}
            className="sf-task-subtask"
            onClick={() =>
              toggleSubtask(task.id, subtask.id)
            }
          >
            {subtask.completed ? (
              <Check size={15} />
            ) : (
              <Circle size={15} />
            )}

            <span
              style={{
                textDecoration: subtask.completed
                  ? "line-through"
                  : "none",
              }}
            >
              {subtask.title}
            </span>
          </button>
        ))}

        <form onSubmit={handleAddSubtask}>
          <input
            placeholder="+ Añadir subtarea"
            value={subtaskTitle}
            onChange={(event) =>
              setSubtaskTitle(event.target.value)
            }
          />
        </form>
      </div>

            <div className="sf-task-card-footer">
        <select
          value={task.status}
          onChange={(event) =>
            updateStatus(
              task.id,
              event.target.value as TaskStatus
            )
          }
        >
          <option value="pending">Pendiente</option>
          <option value="in_progress">En progreso</option>
          <option value="completed">Completada</option>
        </select>

        <TaskScheduleButton
          taskId={task.id}
          taskTitle={task.title}
          priority={task.priority}
        />
      </div>
    </article>
  );
}

export function TaskBoard() {
  const tasks = useTasksStore((state) => state.tasks);
  const addTask = useTasksStore((state) => state.addTask);
  const goals = useGoalsStore((state) => state.goals);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] =
    useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [goalId, setGoalId] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || null,
      goalId: goalId || null,
    });

    setTitle("");
    setDescription("");
    setDueDate("");
  }

  return (
    <div className="sf-tasks-layout">
      <section className="sf-card sf-task-create">
        <h3>Nueva tarea</h3>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Nombre de la tarea"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />

          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            rows={3}
          />

          <label>
            Prioridad
            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as TaskPriority)
              }
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
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
            Objetivo asociado
            <select
              value={goalId}
              onChange={(event) =>
                setGoalId(event.target.value)
              }
            >
              <option value="">Sin objetivo</option>

              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="sf-task-create-btn">
            <Plus size={17} />
            Crear tarea
          </button>
        </form>
      </section>

      <div className="sf-task-board">
        {columns.map((column) => {
          const columnTasks = tasks.filter(
            (task) => task.status === column.id
          );

          return (
            <section
              key={column.id}
              className="sf-task-column"
            >
              <div className="sf-task-column-header">
                <h3>{column.title}</h3>
                <span>{columnTasks.length}</span>
              </div>

              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}

              {columnTasks.length === 0 && (
                <p className="sf-task-empty">
                  No hay tareas aquí.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
