
import type { DailyFocusData } from "../statistics.types";

interface FocusChartProps {
  data: DailyFocusData[];
}

export function FocusChart({
  data,
}: FocusChartProps) {
  const maxSeconds = Math.max(
    1,
    ...data.map((item) => item.seconds)
  );

  return (
    <section className="sf-card sf-focus-chart">
      <div className="sf-statistics-card-header">
        <h3>Tiempo de concentración</h3>
        <span>Minutos por día</span>
      </div>

      <div className="sf-focus-chart-scroll">
        <div className="sf-focus-chart-bars">
          {data.map((item) => {
            const minutes = Math.round(
              item.seconds / 60
            );

            const height =
              item.seconds === 0
                ? 0
                : Math.max(
                    4,
                    (item.seconds / maxSeconds) * 100
                  );

            return (
              <div
                className="sf-focus-chart-column"
                key={item.date}
              >
                <div className="sf-focus-chart-value">
                  {minutes > 0 ? `${minutes}m` : ""}
                </div>

                <div className="sf-focus-chart-track">
                  <div
                    className="sf-focus-chart-bar"
                    style={{
                      height: `${height}%`,
                    }}
                    title={`${item.date}: ${minutes} minutos`}
                  />
                </div>

                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
