
export const dashboardStats = [
  {
    id: "focus",
    label: "Enfoque",
    value: "4h 30m",
    detail: "de 6h",
    color: "orange",
  },
  {
    id: "tasks",
    label: "Tareas",
    value: "3 / 6",
    detail: "completadas",
    color: "green",
  },
  {
    id: "projects",
    label: "Proyectos",
    value: "72%",
    detail: "promedio",
    color: "blue",
  },
  {
    id: "habits",
    label: "Hábitos",
    value: "5 / 7",
    detail: "esta semana",
    color: "purple",
  },
];

export const goalStages = [
  {
    id: 1,
    title: "Fundamentos",
    description: "Bases y conceptos clave",
    status: "completed",
  },
  {
    id: 2,
    title: "Álgebra esencial",
    description: "Ecuaciones y funciones",
    status: "completed",
  },
  {
    id: 3,
    title: "Geometría",
    description: "Figuras y trigonometría",
    status: "current",
  },
  {
    id: 4,
    title: "Precálculo",
    description: "Funciones avanzadas",
    status: "locked",
  },
  {
    id: 5,
    title: "Cálculo",
    description: "Derivadas e integrales",
    status: "locked",
  },
] as const;

export const todayActivities = [
  {
    id: 1,
    time: "08:00",
    title: "Desayuno y rutina",
    duration: "30 min",
    category: "routine",
  },
  {
    id: 2,
    time: "09:00",
    title: "Proyecto principal",
    duration: "2 horas",
    category: "project",
  },
  {
    id: 3,
    time: "11:30",
    title: "Aprender inglés",
    duration: "45 min",
    category: "learning",
  },
  {
    id: 4,
    time: "13:00",
    title: "Comida y descanso",
    duration: "1 hora",
    category: "routine",
  },
  {
    id: 5,
    time: "15:00",
    title: "Revisar pagos",
    duration: "20 min",
    category: "finance",
  },
];

export const dashboardProjects = [
  {
    id: 1,
    name: "Silvana Focus",
    description: "Plataforma de productividad",
    progress: 25,
  },
  {
    id: 2,
    name: "Proyecto personal",
    description: "Desarrollo y planificación",
    progress: 60,
  },
];

export const upcomingReminders = [
  {
    id: 1,
    title: "Pago de tarjeta",
    date: "En 4 días",
  },
  {
    id: 2,
    title: "Revisión de proyecto",
    date: "Mañana",
  },
];
