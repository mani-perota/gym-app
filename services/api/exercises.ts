import { apiClient } from "./client";
import type {
  Exercise,
  MuscleGroup,
  Equipment,
  DifficultyLevel,
  PaginatedResponse,
} from "@/types";

/** Parámetros para listar ejercicios */
interface ListExercisesParams {
  page?: number;
  limit?: number;
  grupoMuscular?: MuscleGroup;
  equipamiento?: Equipment;
  dificultad?: DifficultyLevel;
}

/** Parámetros para buscar ejercicios */
interface SearchExercisesParams {
  q: string;
  limit?: number;
}

/**
 * Servicios de ejercicios (API remota)
 */
export const exercisesApiService = {
  /**
   * Lista ejercicios con paginación y filtros
   */
  async list(
    params: ListExercisesParams = {}
  ): Promise<PaginatedResponse<Exercise>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.set("page", params.page.toString());
    if (params.limit) queryParams.set("limit", params.limit.toString());
    if (params.grupoMuscular) queryParams.set("grupoMuscular", params.grupoMuscular);
    if (params.equipamiento) queryParams.set("equipamiento", params.equipamiento);
    if (params.dificultad) queryParams.set("dificultad", params.dificultad);

    const query = queryParams.toString();
    const endpoint = `/exercises${query ? `?${query}` : ""}`;

    return apiClient.get<PaginatedResponse<Exercise>>(endpoint);
  },

  /**
   * Busca ejercicios por nombre
   */
  async search(params: SearchExercisesParams): Promise<{ ejercicios: Exercise[]; total: number }> {
    const queryParams = new URLSearchParams();
    queryParams.set("q", params.q);
    if (params.limit) queryParams.set("limit", params.limit.toString());

    return apiClient.get<{ ejercicios: Exercise[]; total: number }>(
      `/exercises/search?${queryParams.toString()}`
    );
  },

  /**
   * Obtiene un ejercicio por ID
   */
  async getById(id: string): Promise<{ ejercicio: Exercise }> {
    return apiClient.get<{ ejercicio: Exercise }>(`/exercises/${id}`);
  },
};

