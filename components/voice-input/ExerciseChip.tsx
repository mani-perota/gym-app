import { View, Text, Pressable } from "react-native";
import { X } from "lucide-react-native";
import Animated, {
  FadeOut,
  FadeInDown,
  LinearTransition,
} from "react-native-reanimated";
import { DARK_COLORS } from "@/constants/Colors";
import type { WorkoutSetWithName } from "@/types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ExerciseChipProps {
  ejercicio: WorkoutSetWithName;
  onRemove: () => void;
  onPress?: () => void;
  index: number;
}

/**
 * Chip minimalista para ejercicio agregado.
 * Dark premium - nombre + X inline.
 */
export function ExerciseChip({ ejercicio, onRemove, onPress, index }: ExerciseChipProps) {
  return (
    <AnimatedPressable
      onPress={onPress}
      entering={FadeInDown.delay(index * 25).springify()}
      exiting={FadeOut.duration(100)}
      layout={LinearTransition.springify()}
      className="flex-row items-center mr-1.5 mb-1.5"
      style={{
        backgroundColor: DARK_COLORS.elevated,
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      {/* Nombre */}
      <Text
        className="text-[11px]"
        style={{ fontFamily: "Quicksand-Bold", color: DARK_COLORS.text }}
        numberOfLines={1}
      >
        {ejercicio.nombreEjercicio}
      </Text>

      {/* X simple sin fondo */}
      <Pressable
        onPress={(e) => {
          e.stopPropagation?.();
          onRemove();
        }}
        hitSlop={8}
        className="ml-1.5"
      >
        <X size={10} color={DARK_COLORS.textMuted} strokeWidth={2} />
      </Pressable>
    </AnimatedPressable>
  );
}
