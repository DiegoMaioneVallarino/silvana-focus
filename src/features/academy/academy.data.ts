
import type { Course } from "./academy.types";

export const initialCourses: Course[] = [
  {
    id: "academy-math",
    title: "Fundamentos de matemáticas",
    description:
      "Refuerza tus conocimientos matemáticos desde las operaciones básicas.",
    emoji: "📐",
    color: "#873cff",
    goalId: null,
    createdAt: new Date().toISOString(),
    units: [
      {
        id: "math-unit-1",
        title: "Operaciones fundamentales",
        description: "Construye una base sólida.",
        lessons: [
          {
            id: "math-lesson-1",
            title: "Introducción a los números",
            description: "Comprende los números naturales.",
            type: "reading",
            content:
              "Los números naturales se utilizan para contar cantidades.\n\nEjemplos: 1, 2, 3, 4, 5...\n\nLa suma combina cantidades y la resta calcula diferencias.\n\nPor ejemplo: 5 + 3 = 8 y 8 - 3 = 5.",
            questions: [],
            passingScore: 0,
          },
          {
            id: "math-lesson-2",
            title: "Suma y resta",
            description: "Practica las operaciones básicas.",
            type: "quiz",
            content: "",
            passingScore: 70,
            questions: [
              {
                id: "math-q1",
                question: "¿Cuánto es 8 + 7?",
                options: ["14", "15", "16", "17"],
                correctOption: 1,
                explanation: "8 + 7 = 15.",
              },
              {
                id: "math-q2",
                question: "¿Cuánto es 20 - 9?",
                options: ["11", "12", "10", "9"],
                correctOption: 0,
                explanation: "20 - 9 = 11.",
              },
              {
                id: "math-q3",
                question: "¿Cuánto es 6 + 4?",
                options: ["9", "11", "10", "12"],
                correctOption: 2,
                explanation: "6 + 4 = 10.",
              },
            ],
          },
          {
            id: "math-lesson-3",
            title: "Multiplicación",
            description: "Aprende las sumas repetidas.",
            type: "reading",
            content:
              "La multiplicación representa una suma repetida.\n\nPor ejemplo: 3 × 4 significa sumar 4 tres veces.\n\n4 + 4 + 4 = 12.\n\nPor lo tanto, 3 × 4 = 12.",
            questions: [],
            passingScore: 0,
          },
          {
            id: "math-lesson-4",
            title: "Evaluación de la unidad",
            description: "Demuestra lo aprendido.",
            type: "quiz",
            content: "",
            passingScore: 75,
            questions: [
              {
                id: "math-q4",
                question: "¿Cuánto es 7 × 6?",
                options: ["36", "42", "48", "40"],
                correctOption: 1,
                explanation: "7 × 6 = 42.",
              },
              {
                id: "math-q5",
                question: "¿Cuánto es 15 - 8?",
                options: ["6", "8", "7", "9"],
                correctOption: 2,
                explanation: "15 - 8 = 7.",
              },
              {
                id: "math-q6",
                question: "¿Cuánto es 9 + 5?",
                options: ["14", "13", "15", "16"],
                correctOption: 0,
                explanation: "9 + 5 = 14.",
              },
              {
                id: "math-q7",
                question: "¿Cuánto es 4 × 5?",
                options: ["25", "16", "20", "24"],
                correctOption: 2,
                explanation: "4 × 5 = 20.",
              },
            ],
          },
        ],
      },
    ],
  },
];
