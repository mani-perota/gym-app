import { View, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ExerciseAutocomplete } from "@/components/ui";
import { DARK_COLORS } from "@/constants/Colors";
import type { Exercise } from "@/types";

const AnimatedView = Animated.createAnimatedComponent(View);

interface ExerciseSelectorProps {
    ejercicioNombre: string;
    onEjercicioNombreChange: (text: string) => void;
    ejercicioSeleccionado: Exercise | null;
    onSelectExercise: (exercise: Exercise | null) => void;
}

export function ExerciseSelector({
    ejercicioNombre,
    onEjercicioNombreChange,
    ejercicioSeleccionado,
    onSelectExercise,
}: ExerciseSelectorProps) {
    return (
        <AnimatedView entering={FadeInDown.delay(100)} className="mb-8">
            {/* Header Section with better visual hierarchy */}
            <View className="mb-4">
                <View className="flex-row items-center">
                    <View
                        className="w-1 h-6 rounded-full mr-3"
                        style={{ backgroundColor: DARK_COLORS.cyan }}
                    />
                    <Text
                        className="text-base tracking-wide"
                        style={{
                            fontFamily: "Nunito-Bold",
                            color: DARK_COLORS.cyan,
                            fontSize: 16
                        }}
                    >
                        Seleccionar Ejercicio
                    </Text>
                </View>
            </View>

            {/* Autocomplete Component */}
            <ExerciseAutocomplete
                value={ejercicioNombre}
                onChangeText={onEjercicioNombreChange}
                selectedExercise={ejercicioSeleccionado}
                onSelectExercise={onSelectExercise}
            />
        </AnimatedView>
    );
}
