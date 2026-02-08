import { useState, useCallback } from "react";
import { workoutsService, ApiError } from "@/services/api";
import type { Workout, WorkoutSet, Pagination } from "@/types";

interface WorkoutsState {
  workouts: Workout[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
}

interface UseWorkoutsReturn extends WorkoutsState {
  fetchWorkouts: (page?: number) => Promise<void>;
  createWorkout: (data: CreateWorkoutData) => Promise<Workout | null>;
  updateWorkout: (id: string, data: Partial<CreateWorkoutData>) => Promise<Workout | null>;
  getWorkoutById: (id: string) => Promise<Workout | null>;
  deleteWorkout: (id: string) => Promise<boolean>;
  clearError: () => void;
}

interface CreateWorkoutData {
  fecha?: string;
  nombre?: string;
  ejercicios: WorkoutSet[];
  duracionMinutos?: number;
  notas?: string;
}

/**
 * Hook para manejar entrenamientos
 *
 * Uso:
 * const { workouts, isLoading, fetchWorkouts, createWorkout } = useWorkouts();
 */
export function useWorkouts(): UseWorkoutsReturn {
  const [state, setState] = useState<WorkoutsState>({
    workouts: [],
    pagination: null,
    isLoading: false,
    error: null,
  });

  /**
   * Obtiene la lista de entrenamientos
   */
  const fetchWorkouts = useCallback(async (page: number = 1) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await workoutsService.list({ page, limit: 20 });
      setState({
        workouts: response.workouts || [],
        pagination: response.pagination,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Error al cargar entrenamientos";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
    }
  }, []);

  /**
   * Crea un nuevo entrenamiento
   */
  const createWorkout = useCallback(
    async (data: CreateWorkoutData): Promise<Workout | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const { workout } = await workoutsService.create(data);
        setState((prev) => ({
          ...prev,
          workouts: [workout, ...prev.workouts],
          isLoading: false,
          error: null,
        }));
        return workout;
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : "Error al crear entrenamiento";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        return null;
      }
    },
    []
  );

  /**
   * Elimina un entrenamiento
   */
  const deleteWorkout = useCallback(async (id: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await workoutsService.delete(id);
      setState((prev) => ({
        ...prev,
        workouts: prev.workouts.filter((w) => w._id !== id),
        isLoading: false,
        error: null,
      }));
      return true;
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Error al eliminar entrenamiento";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      return false;
    }
  }, []);

  /**
   * Limpia el error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  /**
   * Actualiza un entrenamiento existente
   */
  const updateWorkout = useCallback(
    async (id: string, data: Partial<CreateWorkoutData>): Promise<Workout | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const { workout } = await workoutsService.update(id, data);
        setState((prev) => ({
          ...prev,
          workouts: prev.workouts.map((w) => (w._id === id ? workout : w)),
          isLoading: false,
          error: null,
        }));
        return workout;
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : "Error al actualizar entrenamiento";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        return null;
      }
    },
    []
  );

  /**
   * Obtiene un entrenamiento por ID
   */
  const getWorkoutById = useCallback(async (id: string): Promise<Workout | null> => {
    try {
      const { workout } = await workoutsService.getById(id);
      return workout;
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Error al obtener entrenamiento";
      setState((prev) => ({
        ...prev,
        error: message,
      }));
      return null;
    }
  }, []);

  return {
    ...state,
    fetchWorkouts,
    createWorkout,
    updateWorkout,
    getWorkoutById,
    deleteWorkout,
    clearError,
  };
}

