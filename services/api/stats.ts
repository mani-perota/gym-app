import { apiClient } from "./client";
import type {
  ConsistencyData,
  MuscleDistribution,
  ProgressionData,
  PersonalRecord,
} from "@/types";

/**
 * Servicio de API para estadísticas y reportes
 */
export const statsService = {
  /**
   * Obtiene los datos de consistencia (heatmap) de los últimos 6 meses
   */
  async getConsistency(): Promise<ConsistencyData[]> {
    return apiClient.get<ConsistencyData[]>("/stats/consistency", true);
  },

  /**
   * Obtiene la distribución muscular de los últimos 30 días
   */
  async getMuscleDistribution(): Promise<MuscleDistribution[]> {
    return apiClient.get<MuscleDistribution[]>("/stats/muscle-distribution", true);
  },

  /**
   * Obtiene los datos de progresión de un ejercicio específico
   */
  async getProgression(ejercicioId: string): Promise<ProgressionData[]> {
    return apiClient.get<ProgressionData[]>(
      `/stats/progression/${ejercicioId}`,
      true
    );
  },

  /**
   * Obtiene los récords personales del usuario
   */
  async getRecords(): Promise<PersonalRecord[]> {
    return apiClient.get<PersonalRecord[]>("/stats/records", true);
  },
};


