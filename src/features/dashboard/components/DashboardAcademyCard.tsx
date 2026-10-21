
import { Link } from "react-router-dom";
import { GraduationCap, ArrowUpRight } from "lucide-react";

import { useAcademyStore } from "../../academy/academy.store";
import {
  getCourseCompletion,
  getCourseLessons,
} from "../../academy/academy.utils";

export function DashboardAcademyCard() {
  const courses = useAcademyStore((s) => s.courses);
  const progress = useAcademyStore((s) => s.progress);

  const ranked = courses
    .map((course) => ({
      course,
      percentage: getCourseCompletion(
        course,
        progress[course.id]
      ),
      lessons: getCourseLessons(course).length,
    }))
    .filter((item) => item.lessons > 0)
    .sort((a, b) => b.percentage - a.percentage);

  const featured = ranked[0];

  return (
    <section className="sf-card sf-dashboard-widget">
      <div className="sf-dashboard-widget-header">
        <div className="sf-dashboard-widget-title">
          <GraduationCap size={19} color="#3d73ff" />
          <h3>Academia</h3>
        </div>

        <Link to="/academy">
          <ArrowUpRight size={17} />
        </Link>
      </div>

      {featured ? (
        <>
          <span className="sf-dashboard-widget-label">
            Curso destacado
          </span>

          <strong className="sf-dashboard-widget-value">
            {featured.percentage}%
          </strong>

          <p className="sf-dashboard-course-title">
            {featured.course.emoji} {featured.course.title}
          </p>

          <div className="sf-finance-progress">
            <div
              style={{
                width: `${featured.percentage}%`,
                background: featured.course.color,
              }}
            />
          </div>

          <Link
            to={`/academy/${featured.course.id}`}
            className="sf-dashboard-widget-action"
          >
            Continuar aprendiendo
          </Link>
        </>
      ) : (
        <p className="sf-muted">
          Aún no tienes cursos con lecciones.
        </p>
      )}
    </section>
  );
}
