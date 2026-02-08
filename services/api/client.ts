import AsyncStorage from "@react-native-async-storage/async-storage";

// URL base de la API
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://zf355xey69.execute-api.us-east-1.amazonaws.com";

// Clave para almacenar el token
const TOKEN_KEY = "@gym-app/auth-token";

/** Respuesta genérica de la API */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Error de la API */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Cliente HTTP base con manejo de tokens JWT
 */
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  /** Carga el token desde AsyncStorage */
  private async loadToken(): Promise<void> {
    try {
      this.token = await AsyncStorage.getItem(TOKEN_KEY);
    } catch {
      this.token = null;
    }
  }

  /** Guarda el token en AsyncStorage */
  async setToken(token: string): Promise<void> {
    this.token = token;
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  /** Obtiene el token actual */
  getToken(): string | null {
    return this.token;
  }

  /** Elimina el token (logout) */
  async clearToken(): Promise<void> {
    this.token = null;
    await AsyncStorage.removeItem(TOKEN_KEY);
  }

  /** Verifica si hay un token guardado */
  isAuthenticated(): boolean {
    return this.token !== null;
  }

  /** Construye los headers de la petición */
  private getHeaders(authenticated: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authenticated && this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /** Realiza una petición HTTP */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    authenticated: boolean = false
  ): Promise<T> {
    // Asegurar que el token esté cargado
    if (authenticated && !this.token) {
      await this.loadToken();
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders(authenticated);

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.error || "Error en la petición"
      );
    }

    // La API retorna { success: true, data: ... }
    if (data.success === false) {
      throw new ApiError(400, data.error || "Error desconocido");
    }

    return data.data as T;
  }

  /** GET request */
  async get<T>(
    endpoint: string,
    options?: { params?: Record<string, any>; authenticated?: boolean } | boolean
  ): Promise<T> {
    // Handle backward compatibility: if options is a boolean, it's the authenticated flag
    const authenticated = typeof options === "boolean" ? options : (options?.authenticated ?? true);
    
    // Build query string if params are provided
    let url = endpoint;
    if (typeof options === "object" && options.params) {
      const queryParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        url = `${endpoint}?${queryString}`;
      }
    }
    
    return this.request<T>(url, { method: "GET" }, authenticated);
  }

  /** POST request */
  async post<T>(
    endpoint: string,
    body: unknown,
    authenticated: boolean = false
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      authenticated
    );
  }

  /** PUT request */
  async put<T>(
    endpoint: string,
    body: unknown,
    authenticated: boolean = false
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
      authenticated
    );
  }

  /** DELETE request */
  async delete<T>(endpoint: string, authenticated: boolean = true): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" }, authenticated);
  }
}

// Instancia singleton del cliente
export const apiClient = new ApiClient(API_BASE_URL);

