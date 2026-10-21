
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, GraduationCap } from "lucide-react";

import { useAcademyStore } from "../features/academy/academy.store";

import { CourseCard } from "../features/academy/components/CourseCard";
import { CourseForm } from "../features/academy/components/CourseForm";

import "./AcademyPage.css";

export function AcademyPage() {
  const navigate = useNavigate();

  const courses = useAcademyStore(
    (state) => state.courses
  );

  const progress = useAcademyStore(
    (state) => state.progress
  );

  const [showForm, setShowForm] = useState(false);

  return (
    <div className="sf-academy-page">
      <header className="sf-academy-header">
        <div>
          <h2>Academia</h2>
          <p className="sf-muted">
            Aprende algo nuevo cada día.
          </p>
        </div>

        <button
          className="sf-academy-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <X size={17} />
          ) : (
            <Plus size={17} />
          )}

          {showForm ? "Cerrar" : "Nuevo curso"}
        </button>
      </header>

      {showForm && (
        <div className="sf-card sf-academy-form-panel">
          <CourseForm
            onCreated={(id) =>
              navigate(`/academy/${id}`)
            }
          />
        </div>
      )}

      <section className="sf-academy-intro sf-card">
        <GraduationCap
          size={30}
          color="#873cff"
        />

        <div>
          <h3>Tu espacio de aprendizaje</h3>
          <p>
            Sigue rutas de aprendizaje, completa
            lecciones y supera evaluaciones.
          </p>
        </div>
      </section>

      <div className="sf-academy-courses">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            progress={progress[course.id]}
          />
        ))}
      </div>
    </div>
  );
}
