import { apiClient } from "./client";
import type { ProgressSummary, ProgressHistory } from "@/types";

/** Parámetros para obtener historial */
interface HistoryParams {
  days?: number;
}

/**
 * Servicios de progreso (requieren autenticación)
 */
export const progressService = {
  /**
   * Obtiene el resumen de progreso (hoy, semana, mes)
   */
  async summary(): Promise<ProgressSummary> {
    return apiClient.get<ProgressSummary>("/progress/summary", true);
  },

  /**
   * Obtiene el historial de progreso para gráficas
   */
  async history(params: HistoryParams = {}): Promise<ProgressHistory> {
    const queryParams = new URLSearchParams();
    if (params.days) queryParams.set("days", params.days.toString());

    const query = queryParams.toString();
    const endpoint = `/progress/history${query ? `?${query}` : ""}`;

    return apiClient.get<ProgressHistory>(endpoint, true);
  },
};

