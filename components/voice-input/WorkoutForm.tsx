import { View, Text, Pressable } from "react-native";
import { Plus } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";
import { ExerciseAutocomplete, NumericStepper } from "@/components/ui";
import { DARK_COLORS } from "@/constants/Colors";
import type { Exercise } from "@/types";

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
  const buttonScale = useSharedValue(1);

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <View className="w-full px-5">
      {/* Título de sección con ícono de acento */}
      <View className="flex-row items-center mb-5 ml-1">
        <View
          className="w-1 h-4 rounded-full mr-3"
          style={{ backgroundColor: DARK_COLORS.cyan }}
        />
        <Text
          className="text-[10px] uppercase tracking-[2px]"
          style={{ fontFamily: "Nunito-Bold", color: DARK_COLORS.textSecondary }}
        >
          {tieneEjercicios ? "Siguiente Ejercicio" : "Configura tu set"}
        </Text>
      </View>

      {/* 1. BUSCADOR DE EJERCICIOS */}
      <AnimatedView entering={FadeInDown.delay(50)} className="z-50">
        <ExerciseAutocomplete
          value={ejercicioNombre}
          onChangeText={onEjercicioNombreChange}
          onSelectExercise={onSelectExercise}
          selectedExercise={ejercicioSeleccionado}
          placeholder="Buscar ejercicio..."
          darkMode={true}
        />
      </AnimatedView>

      {/* 2. ESPACIADOR */}
      <View className="h-4 w-full" />

      {/* 3. CARD DE CONTROLES NUMÉRICOS */}
      <AnimatedView
        entering={FadeInDown.delay(100)}
        className="overflow-hidden"
        style={{
          backgroundColor: DARK_COLORS.surface,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 16,
          shadowColor: DARK_COLORS.cyan,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 24,
          elevation: 8,
        }}
      >
        {/* Fila 1: Series y Reps */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-1">
            <NumericStepper
              value={series}
              onChange={onSeriesChange}
              label="Series"
              min={1}
              size="sm"
            />
          </View>

          <View
            className="w-px"
            style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          />

          <View className="flex-1">
            <NumericStepper
              value={repeticiones}
              onChange={onRepeticionesChange}
              label="Reps"
              min={1}
              size="sm"
            />
          </View>
        </View>

        {/* Separador con gradiente suave */}
        <View
          className="h-px w-full mb-6"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        />

        {/* Fila 2: Peso */}
        <NumericStepper
          value={peso}
          onChange={onPesoChange}
          label="Peso (kg)"
          suffix="KG"
          step={2.5}
          size="md"
        />
      </AnimatedView>

      {/* 4. BOTÓN AGREGAR */}
      <AnimatedView entering={FadeInDown.delay(150)} style={{ marginTop: 24 }}>
        <AnimatedPressable
          onPress={onAgregar}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={buttonAnimatedStyle}
          disabled={!isFormValid || isSubmitting}
        >
          <View
            className="flex-row items-center justify-center overflow-hidden"
            style={{
              height: 52,
              borderRadius: 16,
              backgroundColor: isFormValid
                ? DARK_COLORS.cyanGlow
                : DARK_COLORS.surface,
              borderWidth: 1,
              borderColor: isFormValid
                ? DARK_COLORS.cyan
                : "rgba(255,255,255,0.08)",
              opacity: isFormValid ? 1 : 0.5,
              shadowColor: isFormValid ? DARK_COLORS.cyan : "transparent",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isFormValid ? 0.2 : 0,
              shadowRadius: 12,
              elevation: isFormValid ? 6 : 0,
            }}
          >
            <Plus
              size={20}
              color={isFormValid ? DARK_COLORS.cyan : DARK_COLORS.textMuted}
              strokeWidth={2.5}
            />
            <Text
              className="ml-2 text-base"
              style={{
                fontFamily: "Quicksand-Bold",
                color: isFormValid ? DARK_COLORS.cyan : DARK_COLORS.textMuted,
                letterSpacing: 0.5,
              }}
            >
              Agregar Ejercicio
            </Text>
          </View>
        </AnimatedPressable>
      </AnimatedView>
    </View>
  );
}