
import { Link } from "react-router-dom";
import { CheckSquare2, ArrowUpRight } from "lucide-react";

import { useTasksStore } from "../../tasks/tasks.store";

export function DashboardTasksCard() {
  const tasks = useTasksStore((s) => s.tasks);

  const pending = tasks
    .filter((task) => task.status !== "completed")
    .sort((a, b) => {
      const priority = {
        high: 0,
        medium: 1,
        low: 2,
      };

      return (
        priority[a.priority] - priority[b.priority] ||
        (a.dueDate ?? "9999").localeCompare(
          b.dueDate ?? "9999"
        )
      );
    });

  return (
    <section className="sf-card sf-dashboard-widget">
      <div className="sf-dashboard-widget-header">
        <div className="sf-dashboard-widget-title">
          <CheckSquare2 size={19} color="#ff5a12" />
          <h3>Tareas pendientes</h3>
        </div>

        <Link to="/tasks">
          <ArrowUpRight size={17} />
        </Link>
      </div>

      <strong className="sf-dashboard-widget-value">
        {pending.length}
      </strong>

      <span className="sf-dashboard-widget-label">
        Tareas por completar
      </span>

      <div className="sf-dashboard-task-list">
        {pending.slice(0, 3).map((task) => (
          <div
            key={task.id}
            className="sf-dashboard-task-item"
          >
            <span
              className={`sf-dashboard-priority ${task.priority}`}
            />

            <span>{task.title}</span>
          </div>
        ))}

        {pending.length === 0 && (
          <p className="sf-muted">
            ¡No tienes tareas pendientes!
          </p>
        )}
      </div>
    </section>
  );
}
