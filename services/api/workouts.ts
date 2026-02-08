import { apiClient } from "./client";
import { Workout, PaginatedResponse } from "@/types";

const ENDPOINT = "/workouts";

export const workoutsService = {
  /**
   * Listar todos los entrenamientos (paginado)
   */
  list: async (params: { page?: number; limit?: number } = {}) => {
    return await apiClient.get<PaginatedResponse<Workout>>(ENDPOINT, { params, authenticated: true });
  },

  /**
   * Obtener un entrenamiento por ID
   */
  get: async (id: string) => {
    return await apiClient.get<Workout>(`${ENDPOINT}/${id}`, true);
  },

  /**
   * Crear un nuevo entrenamiento
   */
  create: async (data: Partial<Workout>) => {
    return await apiClient.post<Workout>(ENDPOINT, data, true);
  },

  /**
   * Actualizar un entrenamiento existente
   */
  update: async (id: string, data: Partial<Workout>) => {
    return await apiClient.put<Workout>(`${ENDPOINT}/${id}`, data, true);
  },

  /**
   * Eliminar un entrenamiento
   */
  delete: async (id: string) => {
    await apiClient.delete(`${ENDPOINT}/${id}`, true);
  },

  /**
   * Obtener entrenamientos de una fecha específica
   */
  getByDate: async (date: string) => {
    // date format: YYYY-MM-DD
    return await apiClient.get(`${ENDPOINT}/date/${date}`, true);
  },

  /**
   * Obtener resumen semanal alrededor de una fecha
   */
  getWeekly: async (date: string) => {
    return await apiClient.get(`${ENDPOINT}/weekly/${date}`, true);
  },

  /**
   * Obtener resumen mensual para un mes específico
   */
  getMonthly: async (date: string) => {
    return await apiClient.get(`${ENDPOINT}/monthly/${date}`, true);
  }
};


