import { useState, useCallback, useEffect } from "react";
import { statsService, ApiError } from "@/services/api";
import type {
  ConsistencyData,
  MuscleDistribution,
  ProgressionData,
  PersonalRecord,
} from "@/types";

interface StatsState {
  consistency: ConsistencyData[];
  muscleDistribution: MuscleDistribution[];
  progression: ProgressionData[];
  records: PersonalRecord[];
  isLoading: boolean;
  isLoadingProgression: boolean;
  error: string | null;
}

interface UseStatsReturn extends StatsState {
  fetchAllStats: () => Promise<void>;
  fetchProgression: (ejercicioId: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Hook para manejar estadísticas y reportes del usuario
 *
 * Uso:
 * const { consistency, muscleDistribution, records, isLoading, fetchAllStats, fetchProgression } = useStats();
 */
export function useStats(): UseStatsReturn {
  const [state, setState] = useState<StatsState>({
    consistency: [],
    muscleDistribution: [],
    progression: [],
    records: [],
    isLoading: false,
    isLoadingProgression: false,
    error: null,
  });

  /**
   * Carga todas las estadísticas principales
   */
  const fetchAllStats = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const [consistency, muscleDistribution, records] = await Promise.all([
        statsService.getConsistency(),
        statsService.getMuscleDistribution(),
        statsService.getRecords(),
      ]);

      setState((prev) => ({
        ...prev,
        consistency,
        muscleDistribution,
        records,
        isLoading: false,
      }));
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Error al cargar estadísticas";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
    }
  }, []);

  /**
   * Carga la progresión de un ejercicio específico
   */
  const fetchProgression = useCallback(async (ejercicioId: string) => {
    setState((prev) => ({ ...prev, isLoadingProgression: true }));

    try {
      const progression = await statsService.getProgression(ejercicioId);
      setState((prev) => ({
        ...prev,
        progression,
        isLoadingProgression: false,
      }));
    } catch (err) {
      console.error("Error cargando progresión:", err);
      setState((prev) => ({
        ...prev,
        progression: [],
        isLoadingProgression: false,
      }));
    }
  }, []);

  /**
   * Limpia el error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Cargar estadísticas al montar el hook
  useEffect(() => {
    fetchAllStats();
  }, [fetchAllStats]);

  return {
    ...state,
    fetchAllStats,
    fetchProgression,
    clearError,
  };
}


