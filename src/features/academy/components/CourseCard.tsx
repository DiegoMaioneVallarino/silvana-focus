
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";

import type {
  Course,
  CourseProgress,
} from "../academy.types";

import {
  getCourseCompletion,
  getCourseLessons,
} from "../academy.utils";

interface CourseCardProps {
  course: Course;
  progress?: CourseProgress;
}

export function CourseCard({
  course,
  progress,
}: CourseCardProps) {
  const percentage = getCourseCompletion(
    course,
    progress
  );

  const lessonCount = getCourseLessons(course).length;

  return (
    <Link
      to={`/academy/${course.id}`}
      className="sf-course-card sf-card"
    >
      <div
        className="sf-course-icon"
        style={{
          background: `${course.color}18`,
        }}
      >
        {course.emoji}
      </div>

      <div className="sf-course-content">
        <h3>{course.title}</h3>
        <p>{course.description}</p>
      </div>

      <div className="sf-course-meta">
        <span>
          <BookOpen size={14} />
          {lessonCount} lecciones
        </span>

        <span>{percentage}% completado</span>
      </div>

      <div className="sf-course-progress">
        <div
          style={{
            width: `${percentage}%`,
            background: course.color,
          }}
        />
      </div>

      <div className="sf-course-link">
        Continuar aprendiendo
        <ArrowRight size={16} />
      </div>
    </Link>
  );
}
