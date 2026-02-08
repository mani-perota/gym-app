import { apiClient } from "./client";
import { Workout, PaginatedResponse } from "@/types";

const ENDPOINT = "/workouts";

export const workoutsService = {
  /**
   * Listar todos los entrenamientos (paginado)
   */
  list: async (params: { page?: number; limit?: number } = {}) => {
    const response = await apiClient.get<PaginatedResponse<Workout>>(ENDPOINT, { params });
    return response.data;
  },

  /**
   * Obtener un entrenamiento por ID
   */
  get: async (id: string) => {
    const response = await apiClient.get<Workout>(`${ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo entrenamiento
   */
  create: async (data: Partial<Workout>) => {
    const response = await apiClient.post<Workout>(ENDPOINT, data);
    return response.data;
  },

  /**
   * Actualizar un entrenamiento existente
   */
  update: async (id: string, data: Partial<Workout>) => {
    const response = await apiClient.put<Workout>(`${ENDPOINT}/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar un entrenamiento
   */
  delete: async (id: string) => {
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },

  /**
   * Obtener entrenamientos de una fecha específica
   */
  getByDate: async (date: string) => {
    // date format: YYYY-MM-DD
    const response = await apiClient.get(`${ENDPOINT}/date/${date}`);
    return response.data;
  },

  /**
   * Obtener resumen semanal alrededor de una fecha
   */
  getWeekly: async (date: string) => {
    const response = await apiClient.get(`${ENDPOINT}/weekly/${date}`);
    return response.data;
  },

  /**
   * Obtener resumen mensual para un mes específico
   */
  getMonthly: async (date: string) => {
    const response = await apiClient.get(`${ENDPOINT}/monthly/${date}`);
    return response.data;
  }
};
