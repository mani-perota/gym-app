/**
 * Servicios de API para conectar con el backend
 *
 * Uso:
 * import { authService, exercisesApiService, workoutsService, progressService } from '@/services/api';
 *
 * // Autenticación
 * await authService.login({ email, password });
 * await authService.register({ email, password, nombre });
 * await authService.logout();
 *
 * // Ejercicios (públicos)
 * const { ejercicios, pagination } = await exercisesApiService.list({ page: 1, limit: 20 });
 * const { ejercicios } = await exercisesApiService.search({ q: 'press' });
 *
 * // Entrenamientos (requieren auth)
 * await workoutsService.create({ ejercicios: [...], nombre: 'Día de pecho' });
 * const { workouts } = await workoutsService.list();
 *
 * // Progreso (requiere auth)
 * const summary = await progressService.summary();
 * const history = await progressService.history({ days: 30 });
 */

export { apiClient, ApiError } from "./client";
export { authService } from "./auth";
export { exercisesApiService } from "./exercises";
export { workoutsService } from "./workouts";
export { progressService } from "./progress";
export { statsService } from "./stats";

