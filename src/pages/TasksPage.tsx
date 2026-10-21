
import { TaskBoard } from "../features/tasks/components/TaskBoard";
import "./TasksPage.css";

export function TasksPage() {
  return (
    <div className="sf-tasks-page">
      <header>
        <h2>Mis tareas</h2>
        <p className="sf-muted">
          Organiza tus pendientes y avanza cada día.
        </p>
      </header>

      <TaskBoard />
    </div>
  );
}
