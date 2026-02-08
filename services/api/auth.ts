import { apiClient } from "./client";
import type { User, AuthResponse, LoginRequest, RegisterRequest } from "@/types";

/**
 * Servicios de autenticación
 */
export const authService = {
  /**
   * Registra un nuevo usuario
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);

    // Guardar el token automáticamente
    if (response.token) {
      await apiClient.setToken(response.token);
    }

    return response;
  },

  /**
   * Inicia sesión
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);

    // Guardar el token automáticamente
    if (response.token) {
      await apiClient.setToken(response.token);
    }

    return response;
  },

  /**
   * Obtiene el usuario actual (requiere autenticación)
   */
  async me(): Promise<{ user: User }> {
    return apiClient.get<{ user: User }>("/auth/me", true);
  },

  /**
   * Cierra sesión (elimina el token)
   */
  async logout(): Promise<void> {
    await apiClient.clearToken();
  },

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  },

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return apiClient.getToken();
  },
};

