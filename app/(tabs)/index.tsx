import { useEffect, useMemo, useState, useCallback } from "react";
import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { GradientBackground, Skeleton } from "@/components/ui";
import { Header, DailySummaryCard, RecentActivityList } from "@/components/home";
import { WorkoutEditor } from "@/components/workout";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { useWorkouts } from "@/hooks/useWorkouts";
import type { ActivityData, UserData, DailySummaryData, Workout, AccentColor, WorkoutSet } from "@/types";

/** Colores de acento disponibles para rotar */
const ACCENT_COLORS: AccentColor[] = ["pink", "blue", "green"];

/**
 * Obtiene el saludo según la hora del día.
 */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

/**
 * Formatea la fecha relativa (ej: "Hace 2h", "Ayer", etc.)
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Ahora";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

/**
 * Transforma un Workout a ActivityData para mostrar en la lista
 */
function workoutToActivity(workout: Workout, index: number): ActivityData {
  const totalSeries = workout.ejercicios.reduce((acc, e) => acc + e.series, 0);
  const totalEjercicios = workout.ejercicios.length;

  return {
    id: workout._id,
    title: workout.nombre || `Entrenamiento`,
    subtitle: `${totalEjercicios} ejercicio${totalEjercicios !== 1 ? "s" : ""} • ${totalSeries} series`,
    iconName: "dumbbell",
    value: workout.duracionMinutos ? `${workout.duracionMinutos} min` : `${totalEjercicios} ej.`,
    timestamp: formatRelativeTime(workout.createdAt),
    accentColor: ACCENT_COLORS[index % ACCENT_COLORS.length],
  };
}

/**
 * Pantalla principal (Home) del dashboard.
 * Muestra el resumen diario y actividades recientes.
 */
export default function HomeScreen() {
  const router = useRouter();
  const greeting = getGreeting();

  // Hooks de datos
  const { user, isAuthenticated } = useAuth();
  const { summary, isLoading: isLoadingProgress, fetchSummary } = useProgress();
  const { workouts, isLoading: isLoadingWorkouts, fetchWorkouts, updateWorkout, deleteWorkout } = useWorkouts();

  // Estado para el editor de workouts
  const [editorVisible, setEditorVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  // Cargar datos al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        fetchSummary();
        fetchWorkouts();
      }
    }, [isAuthenticated, fetchSummary, fetchWorkouts])
  );

  // Transformar usuario autenticado a UserData
  const userData: UserData = useMemo(() => ({
    name: user?.nombre?.split(" ")[0] || "Usuario",
    avatarUrl: undefined,
  }), [user]);

  // Transformar resumen de progreso a DailySummaryData
  const dailySummary: DailySummaryData = useMemo(() => {
    if (!summary) {
      return { exercisesCount: 0, progressPercentage: 0 };
    }

    // Calcular porcentaje basado en entrenamientos de la semana (meta: 5 días)
    const weeklyGoal = 5;
    const progressPercentage = Math.min(
      Math.round((summary.semana.entrenamientos / weeklyGoal) * 100),
      100
    );

    return {
      exercisesCount: summary.hoy.ejercicios,
      progressPercentage,
    };
  }, [summary]);

  // Transformar workouts a ActivityData
  const recentActivities: ActivityData[] = useMemo(() => {
    return workouts.slice(0, 5).map(workoutToActivity);
  }, [workouts]);

  const handleViewAllActivities = () => {
    router.push("/(tabs)/diary");
  };

  // Abrir editor con el workout seleccionado
  const handleEditActivity = useCallback((workoutId: string) => {
    const workout = workouts.find((w) => w._id === workoutId);
    if (workout) {
      setSelectedWorkout(workout);
      setEditorVisible(true);
    }
  }, [workouts]);

  // Cerrar editor
  const handleCloseEditor = useCallback(() => {
    setEditorVisible(false);
    setSelectedWorkout(null);
  }, []);

  // Guardar cambios del editor
  const handleSaveWorkout = useCallback(async (ejercicios: WorkoutSet[]) => {
    if (selectedWorkout) {
      await updateWorkout(selectedWorkout._id, { ejercicios });
      await fetchWorkouts(); // Refrescar lista
    }
  }, [selectedWorkout, updateWorkout, fetchWorkouts]);

  // Eliminar un workout
  const handleDeleteActivity = useCallback(async (workoutId: string) => {
    const deleted = await deleteWorkout(workoutId);
    if (deleted) {
      await fetchSummary(); // Refrescar resumen
    }
  }, [deleteWorkout, fetchSummary]);

  const isLoading = isLoadingProgress || isLoadingWorkouts;

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <Header user={userData} greeting={greeting} />

          {isLoading ? (
            <View style={{ gap: 24 }}>
              {/* Daily Summary Skeleton */}
              <View style={{ height: 140, borderRadius: 24, overflow: 'hidden' }}>
                <Skeleton height="100%" width="100%" borderRadius={24} />
              </View>

              {/* Recent Activity Skeleton */}
              <View style={{ gap: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 }}>
                  <Skeleton width={150} height={24} />
                  <Skeleton width={80} height={20} />
                </View>
                <View style={{ gap: 12 }}>
                  {[1, 2, 3].map((i) => (
                    <View key={i} style={{ height: 80, borderRadius: 16, overflow: 'hidden' }}>
                      <Skeleton height="100%" width="100%" borderRadius={16} />
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <>
              <DailySummaryCard data={dailySummary} />
              <RecentActivityList
                activities={recentActivities}
                onViewAll={handleViewAllActivities}
                onEditActivity={handleEditActivity}
                onDeleteActivity={handleDeleteActivity}
              />
            </>
          )}
        </ScrollView>

        {/* Modal de edición de workout */}
        <WorkoutEditor
          visible={editorVisible}
          workout={selectedWorkout}
          onClose={handleCloseEditor}
          onSave={handleSaveWorkout}
        />
      </SafeAreaView>
    </GradientBackground>
  );
}

