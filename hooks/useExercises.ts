import { useState, useCallback } from "react";
import { exercisesApiService, ApiError } from "@/services/api";
import type { Exercise, MuscleGroup, Equipment, DifficultyLevel, Pagination } from "@/types";

interface ExercisesState {
  exercises: Exercise[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
}

interface UseExercisesReturn extends ExercisesState {
  fetchExercises: (params?: FetchExercisesParams) => Promise<void>;
  searchExercises: (query: string, limit?: number) => Promise<Exercise[]>;
  getExerciseById: (id: string) => Promise<Exercise | null>;
  clearError: () => void;
}

interface FetchExercisesParams {
  page?: number;
  limit?: number;
  grupoMuscular?: MuscleGroup;
  equipamiento?: Equipment;
  dificultad?: DifficultyLevel;
}

/**
 * Hook para manejar ejercicios desde el backend
 *
 * Uso:
 * const { exercises, isLoading, fetchExercises, searchExercises } = useExercises();
 */
export function useExercises(): UseExercisesReturn {
  const [state, setState] = useState<ExercisesState>({
    exercises: [],
    pagination: null,
    isLoading: false,
    error: null,
  });

  /**
   * Obtiene la lista de ejercicios con paginación y filtros
   */
  const fetchExercises = useCallback(async (params: FetchExercisesParams = {}) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await exercisesApiService.list(params);
      setState({
        exercises: response.ejercicios || [],
        pagination: response.pagination,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Error al cargar ejercicios";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
    }
  }, []);

  /**
   * Busca ejercicios por nombre
   * Retorna directamente los resultados para uso en autocompletado
   */
  const searchExercises = useCallback(
    async (query: string, limit: number = 10): Promise<Exercise[]> => {
      if (!query.trim()) {
        return [];
      }

      try {
        const response = await exercisesApiService.search({ q: query, limit });
        return response.ejercicios || [];
      } catch (err) {
        console.error("Error buscando ejercicios:", err);
        return [];
      }
    },
    []
  );

  /**
   * Obtiene un ejercicio por su ID
   */
  const getExerciseById = useCallback(async (id: string): Promise<Exercise | null> => {
    try {
      const response = await exercisesApiService.getById(id);
      return response.ejercicio || null;
    } catch (err) {
      console.error("Error obteniendo ejercicio:", err);
      return null;
    }
  }, []);

  /**
   * Limpia el error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    fetchExercises,
    searchExercises,
    getExerciseById,
    clearError,
  };
}

