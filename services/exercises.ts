import type { MuscleGroup, Equipment } from "@/types";

/**
 * Servicio de ejercicios - Constantes y utilidades para UI
 *
 * NOTA: Los datos ahora vienen del backend.
 * Usar el hook useExercises o exercisesApiService para obtener ejercicios.
 *
 * Este archivo mantiene las constantes de traducción para la UI.
 */

/** Traducciones de grupos musculares para mostrar en UI */
export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  pecho: "Pecho",
  espalda: "Espalda",
  hombros: "Hombros",
  biceps: "Bíceps",
  triceps: "Tríceps",
  piernas: "Piernas",
  gluteos: "Glúteos",
  abdomen: "Abdomen",
  cardio: "Cardio",
  cuerpo_completo: "Cuerpo completo",
};

/** Traducciones de equipamiento para mostrar en UI */
export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  barra: "Barra",
  mancuernas: "Mancuernas",
  maquina: "Máquina",
  cables: "Cables/Poleas",
  peso_corporal: "Peso corporal",
  bandas: "Bandas elásticas",
  kettlebell: "Kettlebell",
  otro: "Otro",
};

/** Traducciones de dificultad para mostrar en UI */
export const DIFFICULTY_LABELS: Record<string, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};
