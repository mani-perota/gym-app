import type { LucideIcon } from "lucide-react-native";

// ============================================
// TIPOS DE UI (COMPONENTES)
// ============================================

/** Colores de acento disponibles para componentes */
export type AccentColor = "pink" | "blue" | "green";

/** Props para el item de actividad */
export interface ActivityItemProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  value: string;
  timestamp: string;
  accentColor: AccentColor;
}

/** Datos de resumen diario */
export interface DailySummaryData {
  exercisesCount: number;
  progressPercentage: number;
}

/** Props para el componente de resumen diario */
export interface DailySummaryCardProps {
  data: DailySummaryData;
}

/** Datos de actividad reciente */
export interface ActivityData {
  id: string;
  title: string;
  subtitle: string;
  iconName: "dumbbell" | "heart-pulse" | "sparkles";
  value: string;
  timestamp: string;
  accentColor: AccentColor;
}

/** Props para la lista de actividades recientes */
export interface RecentActivityListProps {
  activities: ActivityData[];
  onViewAll?: () => void;
}

/** Props para el botón FAB con micrófono */
export interface FabMicProps {
  onPress?: () => void;
}

/** Datos del usuario (UI) */
export interface UserData {
  name: string;
  avatarUrl?: string;
}

/** Props para el header */
export interface HeaderProps {
  user: UserData;
  greeting: string;
}

// ============================================
// TIPOS DE DOMINIO (EJERCICIOS)
// ============================================

/** Grupo muscular */
export type MuscleGroup =
  | "pecho"
  | "espalda"
  | "hombros"
  | "biceps"
  | "triceps"
  | "piernas"
  | "gluteos"
  | "abdomen"
  | "cardio"
  | "cuerpo_completo";

/** Tipo de equipamiento */
export type Equipment =
  | "barra"
  | "mancuernas"
  | "maquina"
  | "cables"
  | "peso_corporal"
  | "bandas"
  | "kettlebell"
  | "otro";

/** Nivel de dificultad */
export type DifficultyLevel = "principiante" | "intermedio" | "avanzado";

/** Datos de un ejercicio */
export interface Exercise {
  _id?: string;
  id?: string;
  nombre: string;
  grupoMuscular: MuscleGroup;
  musculosSecundarios?: MuscleGroup[];
  equipamiento: Equipment;
  dificultad: DifficultyLevel;
  instrucciones?: string;
  imagen?: string;
}

/** Resultado de búsqueda de ejercicios */
export interface ExerciseSearchResult {
  ejercicios: Exercise[];
  total: number;
}

// ============================================
// TIPOS DE API (AUTENTICACIÓN)
// ============================================

/** Usuario del backend */
export interface User {
  _id: string;
  email: string;
  nombre: string;
  createdAt: string;
}

/** Request de registro */
export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
}

/** Request de login */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Respuesta de autenticación */
export interface AuthResponse {
  user: User;
  token: string;
}

// ============================================
// TIPOS DE API (ENTRENAMIENTOS)
// ============================================

/** Set de ejercicio en un entrenamiento */
export interface WorkoutSet {
  ejercicioId: string;
  ejercicio?: Exercise; // Información completa del ejercicio (poblado desde API)
  series: number;
  repeticiones: number;
  peso?: number;
  notas?: string;
}

/** Set de ejercicio con nombre (para UI de rutinas) */
export interface WorkoutSetWithName extends WorkoutSet {
  id: string;
  nombreEjercicio: string;
}

/** Entrenamiento */
export interface Workout {
  _id: string;
  userId: string;
  fecha: string;
  nombre?: string;
  ejercicios: WorkoutSet[];
  duracionMinutos?: number;
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// TIPOS DE API (PROGRESO)
// ============================================

/** Resumen de progreso */
export interface ProgressSummary {
  hoy: {
    entrenamientos: number;
    ejercicios: number;
  };
  semana: {
    entrenamientos: number;
  };
  mes: {
    entrenamientos: number;
  };
  total: {
    entrenamientos: number;
  };
}

/** Datos de un día en el historial */
export interface DayProgress {
  _id: string; // fecha YYYY-MM-DD
  entrenamientos: number;
  ejercicios: number;
  duracionTotal: number;
}

/** Datos por grupo muscular */
export interface MuscleGroupProgress {
  _id: MuscleGroup | null;
  count: number;
}

/** Historial de progreso */
export interface ProgressHistory {
  porDia: DayProgress[];
  porGrupoMuscular: MuscleGroupProgress[];
  periodo: {
    inicio: string;
    fin: string;
    dias: number;
  };
}

// ============================================
// TIPOS GENÉRICOS DE API
// ============================================

/** Información de paginación */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/** Respuesta paginada genérica */
export interface PaginatedResponse<T> {
  ejercicios?: T[];
  workouts?: T[];
  pagination: Pagination;
}

// ============================================
// TIPOS DE ESTADÍSTICAS Y REPORTES
// ============================================

/** Datos de consistencia (para el heatmap) */
export interface ConsistencyData {
  date: string;
  count: number;
}

/** Distribución muscular */
export interface MuscleDistribution {
  muscleGroup: string;
  totalSeries: number;
}

/** Datos de progresión de un ejercicio */
export interface ProgressionData {
  fecha: string;
  volumenTotal: number;
  maxPeso: number;
  estimado1RM: number;
}

/** Récord personal */
export interface PersonalRecord {
  exerciseName: string;
  weight: number;
  date: string;
}
