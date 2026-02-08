import { View, Text, Pressable } from "react-native";
import { Flame, ChevronDown, ChevronUp } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useMemo } from "react";
import { ExerciseChip } from "./ExerciseChip";
import { DARK_COLORS } from "@/constants/Colors";
import type { WorkoutSetWithName } from "@/types";

const AnimatedView = Animated.createAnimatedComponent(View);

const MAX_VISIBLE_DEFAULT = 3;

interface WorkoutSummaryProps {
  ejercicios: WorkoutSetWithName[];
  onRemoveEjercicio: (id: string) => void;
}

/**
 * Resumen de ejercicios agregados a la rutina.
 * Lista vertical colapsable - dark premium design.
 */
export function WorkoutSummary({
  ejercicios,
  onRemoveEjercicio,
}: WorkoutSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasMore = ejercicios.length > MAX_VISIBLE_DEFAULT;
  const hiddenCount = ejercicios.length - MAX_VISIBLE_DEFAULT;

  const visibleEjercicios = useMemo(() => {
    if (isExpanded || !hasMore) {
      return ejercicios;
    }
    return ejercicios.slice(0, MAX_VISIBLE_DEFAULT);
  }, [ejercicios, isExpanded, hasMore]);

  if (ejercicios.length === 0) return null;

  return (
    <AnimatedView
      entering={FadeInDown.springify()}
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: DARK_COLORS.surface,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      {/* Gradient accent bar */}
      <LinearGradient
        colors={[DARK_COLORS.cyan, DARK_COLORS.violet]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: 3 }}
      />

      {/* Content */}
      <View className="px-4 pt-4 pb-3">
        {/* Header */}
        <View className="flex-row items-center mb-3">
          <View
            className="w-6 h-6 rounded-lg items-center justify-center mr-2"
            style={{ backgroundColor: DARK_COLORS.roseGlow }}
          >
            <Flame size={12} color={DARK_COLORS.rose} fill={DARK_COLORS.rose} />
          </View>
          <View className="flex-1">
            <Text
              className="text-[10px] uppercase tracking-[1.5px]"
              style={{ fontFamily: "Nunito-Bold", color: DARK_COLORS.cyan }}
            >
              Resumen
            </Text>
            <Text
              className="text-[11px]"
              style={{ fontFamily: "Nunito", color: DARK_COLORS.textMuted }}
            >
              {ejercicios.length} ejercicio{ejercicios.length !== 1 ? "s" : ""} agregado{ejercicios.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        {/* Exercise chips - flex wrap */}
        <View className="flex-row flex-wrap">
          {visibleEjercicios.map((ej, idx) => (
            <ExerciseChip
              key={ej.id}
              ejercicio={ej}
              onRemove={() => onRemoveEjercicio(ej.id)}
              index={idx}
            />
          ))}
        </View>

        {/* Expand/Collapse button */}
        {hasMore && (
          <Pressable
            onPress={() => setIsExpanded(!isExpanded)}
            className="flex-row items-center justify-center py-3 mt-1"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={14} color={DARK_COLORS.cyan} strokeWidth={2} />
                <Text
                  className="text-xs ml-1"
                  style={{ fontFamily: "Nunito-Bold", color: DARK_COLORS.cyan }}
                >
                  Ver menos
                </Text>
              </>
            ) : (
              <>
                <ChevronDown size={14} color={DARK_COLORS.cyan} strokeWidth={2} />
                <Text
                  className="text-xs ml-1"
                  style={{ fontFamily: "Nunito-Bold", color: DARK_COLORS.cyan }}
                >
                  Ver todos (+{hiddenCount})
                </Text>
              </>
            )}
          </Pressable>
        )}
      </View>
    </AnimatedView>
  );
}
