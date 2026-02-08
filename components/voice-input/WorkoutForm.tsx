import { View, Text, Pressable, ScrollView } from "react-native";
import { Plus, X, Save } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";
import { useState, useEffect } from "react";
import { DARK_COLORS } from "@/constants/Colors";
import type { Exercise } from "@/types";
import { ExerciseSelector } from "./ExerciseSelector";
import { SetTable } from "./SetTable";
import { SetData } from "./SetRow";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

interface WorkoutFormProps {
  ejercicioNombre: string;
  onEjercicioNombreChange: (text: string) => void;
  ejercicioSeleccionado: Exercise | null;
  onSelectExercise: (exercise: Exercise | null) => void;
  series: string;
  onSeriesChange: (val: string) => void;
  repeticiones: string;
  onRepeticionesChange: (val: string) => void;
  peso: string;
  onPesoChange: (val: string) => void;
  onAgregar: () => void;
  isFormValid: boolean;
  isSubmitting: boolean;
  tieneEjercicios: boolean;
}

export function WorkoutForm({
  ejercicioNombre,
  onEjercicioNombreChange,
  ejercicioSeleccionado,
  onSelectExercise,
  series,
  onSeriesChange,
  repeticiones,
  onRepeticionesChange,
  peso,
  onPesoChange,
  onAgregar,
  isFormValid,
  isSubmitting,
  tieneEjercicios,
}: WorkoutFormProps) {
  const saveButtonScale = useSharedValue(1);

  // Estado local para sets - inicializado con valores del form
  const [sets, setSets] = useState<SetData[]>([]);
  const [notas, setNotas] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  // Inicializar sets cuando cambia el ejercicio o valores iniciales
  useEffect(() => {
    if (ejercicioSeleccionado && sets.length === 0) {
      const numSeries = parseInt(series) || 1;
      const pesoNum = parseFloat(peso) || 0;
      const repsNum = parseInt(repeticiones) || 10;

      const newSets: SetData[] = Array.from({ length: numSeries }, (_, i) => ({
        id: (i + 1).toString(),
        set: i + 1,
        kg: pesoNum,
        reps: repsNum,
        rpe: 7,
        completed: false,
      }));
      setSets(newSets);
    }
  }, [ejercicioSeleccionado, series, peso, repeticiones]);



  const handleSavePressIn = () => {
    saveButtonScale.value = withSpring(0.97);
  };

  const handleSavePressOut = () => {
    saveButtonScale.value = withSpring(1);
  };



  const saveButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveButtonScale.value }],
  }));

  const addSet = () => {
    const lastSet = sets[sets.length - 1];
    const newSet: SetData = {
      id: (sets.length + 1).toString(),
      set: sets.length + 1,
      kg: lastSet?.kg || parseFloat(peso) || 0,
      reps: lastSet?.reps || parseInt(repeticiones) || 10,
      rpe: lastSet?.rpe || 7,
      completed: false,
    };
    setSets([...sets, newSet]);
  };

  const removeSet = (id: string) => {
    const filteredSets = sets.filter((s) => s.id !== id);
    const reindexedSets = filteredSets.map((s, index) => ({
      ...s,
      set: index + 1,
    }));
    setSets(reindexedSets);
  };

  const updateSet = (id: string, field: keyof SetData, value: any) => {
    setSets(sets.map((set) => (set.id === id ? { ...set, [field]: value } : set)));
  };

  const toggleCompleted = (id: string) => {
    setSets(sets.map((set) => (set.id === id ? { ...set, completed: !set.completed } : set)));
  };

  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const hasSelectedExercise = ejercicioSeleccionado !== null;
  const exerciseName = ejercicioSeleccionado?.nombre || "";
  const equipmentName = ejercicioSeleccionado?.equipamiento
    ? capitalize(ejercicioSeleccionado.equipamiento.replace("_", " "))
    : "";

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full px-5">
        {/* HEADER */}
        <AnimatedView entering={FadeInDown.delay(50)} className="mb-6">
          <Text
            className="text-2xl"
            style={{ fontFamily: "Nunito-ExtraBold", color: DARK_COLORS.text }}
          >
            Registrar Serie
          </Text>
          <Text
            className="text-sm mt-1"
            style={{ fontFamily: "Nunito-Regular", color: DARK_COLORS.textSecondary }}
          >
            Selecciona un ejercicio y registra tus series
          </Text>
        </AnimatedView>

        {/* SELECTOR DE EJERCICIO */}
        <ExerciseSelector
          ejercicioNombre={ejercicioNombre}
          onEjercicioNombreChange={onEjercicioNombreChange}
          ejercicioSeleccionado={ejercicioSeleccionado}
          onSelectExercise={onSelectExercise}
        />

        {/* EJERCICIO ACTUAL - Solo mostrar si hay ejercicio seleccionado */}
        {hasSelectedExercise && (
          <AnimatedView entering={FadeInDown.delay(150)}>
            <View className="mb-2" />

            <SetTable
              exerciseName={exerciseName}
              equipmentName={equipmentName}
              sets={sets}
              notes={notas}
              showNotes={showNotes}
              onUpdateSet={updateSet}
              onRemoveSet={removeSet}
              onToggleCompleted={toggleCompleted}
              onAddSet={addSet}
              onNotesChange={setNotas}
              onToggleNotes={() => setShowNotes(!showNotes)}
            />
          </AnimatedView>
        )}

        {/* BOTONES DE ACCIÓN */}
        <AnimatedView entering={FadeInDown.delay(200)} className="mt-6 mb-8">
          {/* Botón Guardar */}
          <AnimatedPressable
            onPress={onAgregar}
            onPressIn={handleSavePressIn}
            onPressOut={handleSavePressOut}
            style={[saveButtonAnimatedStyle, { width: "100%" }]}
            disabled={!isFormValid || isSubmitting}
          >
            <View
              className="flex-row items-center justify-center w-full"
              style={{
                height: 56,
                borderRadius: 16,
                backgroundColor: isFormValid ? DARK_COLORS.cyan : DARK_COLORS.surface,
                borderWidth: isFormValid ? 0 : 1,
                borderColor: "rgba(255,255,255,0.08)",
                opacity: isFormValid ? 1 : 0.5,
                shadowColor: isFormValid ? DARK_COLORS.cyan : "transparent",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isFormValid ? 0.3 : 0,
                shadowRadius: 12,
                elevation: isFormValid ? 6 : 0,
              }}
            >
              <Save
                size={22}
                color={isFormValid ? DARK_COLORS.bg : DARK_COLORS.textMuted}
                strokeWidth={2.5}
              />
              <Text
                className="ml-2 text-lg"
                style={{
                  fontFamily: "Nunito-Bold",
                  color: isFormValid ? DARK_COLORS.bg : DARK_COLORS.textMuted,
                  letterSpacing: 0.5,
                }}
              >
                Guardar Ejercicio
              </Text>
            </View>
          </AnimatedPressable>
        </AnimatedView>
      </View>
    </ScrollView>
  );
}