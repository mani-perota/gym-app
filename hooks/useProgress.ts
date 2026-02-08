import { useState, useCallback } from "react";
import { progressService, ApiError } from "@/services/api";
import type { ProgressSummary, ProgressHistory } from "@/types";

interface ProgressState {
  summary: ProgressSummary | null;
  history: ProgressHistory | null;
  isLoading: boolean;
  error: string | null;
}

interface UseProgressReturn extends ProgressState {
  fetchSummary: () => Promise<void>;
  fetchHistory: (days?: number) => Promise<void>;
  clearError: () => void;
}

/**
 * Hook para manejar el progreso del usuario
 *
 * Uso:
 * const { summary, history, fetchSummary, fetchHistory } = useProgress();
 */
export function useProgress(): UseProgressReturn {
  const [state, setState] = useState<ProgressState>({
    summary: null,
    history: null,
    isLoading: false,
    error: null,
  });

  /**
   * Obtiene el resumen de progreso
   */
  const fetchSummary = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const summary = await progressService.summary();
      setState((prev) => ({
        ...prev,
        summary,
        isLoading: false,
        error: null,
      }));
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Error al cargar resumen";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
    }
  }, []);

  /**
   * Obtiene el historial de progreso
   */
  const fetchHistory = useCallback(async (days: number = 30) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const history = await progressService.history({ days });
      setState((prev) => ({
        ...prev,
        history,
        isLoading: false,
        error: null,
      }));
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Error al cargar historial";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
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
    fetchSummary,
    fetchHistory,
    clearError,
  };
}

