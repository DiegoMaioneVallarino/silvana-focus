
import { Trash2, Clock3 } from "lucide-react";

import { useActivityStore } from "../activity.store";
import { formatDuration } from "../activity.utils";

export function ActivityHistory() {
  const sessions = useActivityStore((state) => state.sessions);
  const removeSession = useActivityStore(
    (state) => state.removeSession
  );

  const recentSessions = [...sessions]
    .sort(
      (a, b) =>
        new Date(b.endedAt).getTime() -
        new Date(a.endedAt).getTime()
    )
    .slice(0, 10);

  return (
    <section className="sf-card sf-activity-history">
      <h3>Actividad reciente</h3>

      {recentSessions.length === 0 ? (
        <p className="sf-muted">
          Todavía no has registrado sesiones.
        </p>
      ) : (
        <div className="sf-activity-list">
          {recentSessions.map((session) => (
            <div className="sf-activity-item" key={session.id}>
              <Clock3 size={18} color="#873cff" />

              <div>
                <strong>{session.title}</strong>

                <p>
                  {new Date(session.endedAt).toLocaleDateString()}
                  {" · "}
                  {formatDuration(session.durationSeconds)}
                </p>
              </div>

              <button
                aria-label="Eliminar sesión"
                onClick={() => removeSession(session.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
