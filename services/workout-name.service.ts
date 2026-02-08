import type { WorkoutSet, MuscleGroup } from "@/types";

export class WorkoutNameService {
    /**
     * Genera un nombre sugerido para el entrenamiento basado en los grupos musculares involucrados.
     */
    static generateWorkoutName(sets: WorkoutSet[]): string {
        if (!sets || sets.length === 0) {
            return "Nueva Rutina";
        }

        const muscleGroups = new Set<MuscleGroup>();
        sets.forEach((set) => {
            if (set.ejercicio?.grupoMuscular) {
                muscleGroups.add(set.ejercicio.grupoMuscular);
            }
        });

        if (muscleGroups.size === 0) {
            return `Entrenamiento ${new Date().toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
            })}`;
        }

        const groups = Array.from(muscleGroups);

        // Definir categorizaciones
        const isUpperBody = (g: MuscleGroup) => ["pecho", "espalda", "hombros", "biceps", "triceps"].includes(g);
        const isLowerBody = (g: MuscleGroup) => ["piernas", "gluteos"].includes(g);
        const isCore = (g: MuscleGroup) => g === "abdomen";
        const isCardio = (g: MuscleGroup) => g === "cardio";

        const hasUpper = groups.some(isUpperBody);
        const hasLower = groups.some(isLowerBody);
        const hasCore = groups.some(isCore);
        const hasCardio = groups.some(isCardio);

        // Reglas de nombrado
        if (groups.length === 1) {
            return `Día de ${this.capitalize(groups[0])}`;
        }

        if (groups.length === 2 && ((hasUpper && hasLower) || (hasUpper && hasCore) || (hasLower && hasCore))) {
            return groups.map(this.capitalize).join(" y ");
        }

        if (hasUpper && hasLower) {
            return "Cuerpo Completo";
        }

        if (hasUpper && !hasLower) {
            // Si solo tiene tren superior pero múltiples grupos
            if (groups.every(isUpperBody) && groups.length > 1) {
                if (groups.includes("biceps") && groups.includes("triceps") && groups.length === 2) {
                    return "Día de Brazos";
                }
                return "Tren Superior";
            }
        }

        if (hasLower && !hasUpper) {
            if (groups.every(isLowerBody) && groups.length > 1) {
                return "Tren Inferior";
            }
        }

        // Fallback con los nombres de los grupos principales
        const names = groups.slice(0, 2).map(this.capitalize).join(" y ");
        return `Rutina de ${names}${groups.length > 2 ? "..." : ""}`;
    }

    private static capitalize(text: string): string {
        if (!text) return "";
        return text.charAt(0).toUpperCase() + text.slice(1).replace("_", " ");
    }
}
