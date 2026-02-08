import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { X, Check } from "lucide-react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useState, useCallback, useEffect } from "react";
import { TextInput } from "react-native";
import { WorkoutNameService } from "@/services/workout-name.service";

import { WorkoutForm } from "@/components/voice-input";
import { StatusOverlay } from "@/components/ui";
import { useWorkouts } from "@/hooks";
import { DARK_COLORS } from "@/constants/Colors";
import type { Exercise, WorkoutSetWithName } from "@/types";

const AnimatedView = Animated.createAnimatedComponent(View);

/**
 * Pantalla para agregar una nueva rutina de entrenamiento.
 * Diseño dark premium.
 */
export default function VoiceInputScreen() {
  const router = useRouter();
  const { createWorkout, isLoading } = useWorkouts();

  // --- ESTADO ---
  const [ejercicioNombre, setEjercicioNombre] = useState("");
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState<Exercise | null>(null);
  const [peso, setPeso] = useState("0");
  const [repeticiones, setRepeticiones] = useState("10");
  const [series, setSeries] = useState("1");

  const [ejerciciosEnRutina, setEjerciciosEnRutina] = useState<WorkoutSetWithName[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [workoutName, setWorkoutName] = useState("");
  const [isNameEdited, setIsNameEdited] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- AUTOMATIC NAME GENERATION ---
  useEffect(() => {
    if (!isNameEdited && ejerciciosEnRutina.length > 0) {
      const suggestedName = WorkoutNameService.generateWorkoutName(ejerciciosEnRutina);
      setWorkoutName(suggestedName);
    }
  }, [ejerciciosEnRutina, isNameEdited]);

  // --- HANDLERS ---
  const resetForm = useCallback(() => {
    setEjercicioNombre("");
    setEjercicioSeleccionado(null);
    setPeso("0");
    setRepeticiones("10");
    setSeries("1");
    setEditingId(null);
  }, []);

  const handleAddNew = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const handleEditExercise = useCallback((id: string) => {
    const exerciseToEdit = ejerciciosEnRutina.find(e => e.id === id);
    if (exerciseToEdit) {
      setEditingId(id);
      setEjercicioSeleccionado(exerciseToEdit.ejercicio || null);
      setEjercicioNombre(exerciseToEdit.nombreEjercicio);
      setSeries(exerciseToEdit.series.toString());
      setRepeticiones(exerciseToEdit.repeticiones.toString());
      setPeso((exerciseToEdit.peso || 0).toString());
    }
  }, [ejerciciosEnRutina]);

  const handleAgregarEjercicio = useCallback(() => {
    const ejercicioId = ejercicioSeleccionado?._id || ejercicioSeleccionado?.id;

    if (!ejercicioId || !ejercicioSeleccionado) {
      const msg = "Busca y selecciona un ejercicio primero";
      Platform.OS === "web" ? window.alert(msg) : Alert.alert("Falta ejercicio", msg);
      return;
    }

    const nuevoEjercicio: WorkoutSetWithName = {
      id: editingId || `${Date.now()}`,
      ejercicioId,
      nombreEjercicio: ejercicioSeleccionado.nombre,
      ejercicio: ejercicioSeleccionado,
      series: parseInt(series, 10) || 3,
      repeticiones: parseInt(repeticiones, 10) || 10,
      peso: peso ? parseFloat(peso) : undefined,
    };

    setShowSuccess(true);

    setTimeout(() => {
      setEjerciciosEnRutina((prev) => {
        if (editingId) {
          return prev.map(e => e.id === editingId ? nuevoEjercicio : e);
        }
        return [...prev, nuevoEjercicio];
      });
      setShowSuccess(false);
      resetForm();
    }, 800);
  }, [ejercicioSeleccionado, series, repeticiones, peso, resetForm, editingId]);

  const handleRemoveEjercicio = useCallback((id: string) => {
    setEjerciciosEnRutina((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleGuardarRutina = useCallback(async () => {
    if (ejerciciosEnRutina.length === 0) return;

    const workoutData = {
      fecha: new Date().toISOString(),
      nombre: workoutName || `Entrenamiento ${new Date().toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      })}`,
      ejercicios: ejerciciosEnRutina.map(({ ejercicioId, series, repeticiones, peso }) => ({
        ejercicioId,
        series,
        repeticiones,
        peso,
      })),
    };

    setIsSaving(true);

    // Simular un pequeño delay para que la animación se vea bien
    const result = await createWorkout(workoutData);

    if (result) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSaving(false);
        router.dismiss(); // Usar dismiss si es un modal, o back
      }, 1500);
    } else {
      setIsSaving(false);
      Alert.alert("Error", "No se pudo guardar la rutina");
    }
  }, [ejerciciosEnRutina, createWorkout, router, workoutName]);

  const isFormValid = ejercicioSeleccionado !== null && repeticiones.trim() !== "";
  const tieneEjercicios = ejerciciosEnRutina.length > 0;

  return (
    <View className="flex-1" style={{ backgroundColor: DARK_COLORS.bg }}>
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        >
          <StatusOverlay
            isVisible={showSuccess || isSaving}
            type={isSuccess ? "success" : (showSuccess ? "success" : "loading")}
            message={isSuccess ? "¡Rutina guardada!" : (showSuccess ? "¡Ejercicio agregado!" : "Guardando rutina...")}
          />

          {/* --- HEADER --- */}
          <View className="flex-row items-center justify-between px-6 py-4 z-10">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full shadow-sm"
              style={{ backgroundColor: DARK_COLORS.roseGlow }}
            >
              <X size={20} color={DARK_COLORS.rose} strokeWidth={2.5} />
            </Pressable>

            <TextInput
              value={workoutName || (tieneEjercicios ? "" : "Nueva Rutina")}
              onChangeText={(text) => {
                setWorkoutName(text);
                setIsNameEdited(true);
              }}
              className="flex-1 text-center text-base font-bold tracking-wide"
              style={{
                fontFamily: "Quicksand-Bold",
                color: DARK_COLORS.text,
                paddingHorizontal: 8,
              }}
              placeholder={tieneEjercicios ? "Nombre de la rutina" : "Nueva Rutina"}
              placeholderTextColor={DARK_COLORS.textMuted}
            />

            <View className="w-10" />
          </View>

          {/* --- CONTENIDO SCROLLABLE --- */}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingBottom: 160,
              paddingTop: 10
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* SECCIÓN 1: RESUMEN REMOVED - Integrated in Form */}

            {/* SECCIÓN 2: FORMULARIO */}
            <View className="px-6">
              <WorkoutForm
                ejercicioNombre={ejercicioNombre}
                onEjercicioNombreChange={setEjercicioNombre}
                ejercicioSeleccionado={ejercicioSeleccionado}
                onSelectExercise={setEjercicioSeleccionado}
                series={series}
                onSeriesChange={setSeries}
                repeticiones={repeticiones}
                onRepeticionesChange={setRepeticiones}
                peso={peso}
                onPesoChange={setPeso}
                onAgregar={handleAgregarEjercicio}
                isFormValid={isFormValid}
                isSubmitting={showSuccess}
                tieneEjercicios={tieneEjercicios}
                addedExercises={ejerciciosEnRutina}
                onEditExercise={handleEditExercise}
                onRemoveExercise={handleRemoveEjercicio}
                onAddNew={handleAddNew}
              />
            </View>
          </ScrollView>

          {/* --- BOTÓN GUARDAR (FLOTANTE) --- */}
          {tieneEjercicios && (
            <AnimatedView
              entering={FadeInUp.springify()}
              className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4"
              style={{
                backgroundColor: "rgba(10, 15, 26, 0.95)",
                borderTopWidth: 1,
                borderTopColor: DARK_COLORS.border,
              }}
            >
              <Pressable
                onPress={handleGuardarRutina}
                disabled={isLoading}
                className="h-14 rounded-2xl flex-row items-center justify-center active:opacity-90"
                style={{
                  backgroundColor: DARK_COLORS.cyan,
                  shadowColor: DARK_COLORS.cyan,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 12,
                  elevation: 6,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color={DARK_COLORS.bg} />
                ) : (
                  <>
                    <Check size={20} color={DARK_COLORS.bg} strokeWidth={3} />
                    <Text
                      className="font-bold text-lg ml-2 tracking-wide"
                      style={{ fontFamily: "Quicksand-Bold", color: DARK_COLORS.bg }}
                    >
                      Guardar Rutina
                    </Text>
                  </>
                )}
              </Pressable>
            </AnimatedView>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}