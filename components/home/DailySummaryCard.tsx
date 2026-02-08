import { View, Text } from "react-native";
import { Check } from "lucide-react-native";
import { Card, ProgressBar } from "@/components/ui";
import { DARK_COLORS } from "@/constants/Colors";
import type { DailySummaryCardProps } from "@/types";

/**
 * Tarjeta de resumen diario con diseño dark premium.
 * Muestra ejercicios registrados y barra de progreso con glow.
 */
export function DailySummaryCard({ data }: DailySummaryCardProps) {
  const { exercisesCount, progressPercentage } = data;

  return (
    <View className="px-6 mb-8">
      <Card variant="glass" className="relative overflow-hidden">
        {/* Decoración de fondo con glow */}
        <View
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-30"
          style={{ backgroundColor: DARK_COLORS.cyan, transform: [{ scale: 1.5 }] }}
        />
        <View
          className="absolute -bottom-12 -left-8 w-24 h-24 rounded-full opacity-20"
          style={{ backgroundColor: DARK_COLORS.violet }}
        />

        <View className="flex-row items-end justify-between relative z-10">
          <View>
            <Text
              className="text-4xl text-dark-text"
              style={{ fontFamily: "Quicksand-Bold" }}
            >
              {exercisesCount}
            </Text>
            <Text
              className="text-dark-text-secondary mt-1"
              style={{ fontFamily: "Nunito-SemiBold" }}
            >
              ejercicios registrados hoy
            </Text>
          </View>

          <View
            className="h-10 w-10 rounded-full items-center justify-center"
            style={{ backgroundColor: DARK_COLORS.emeraldGlow }}
          >
            <Check size={20} color={DARK_COLORS.emerald} strokeWidth={3} />
          </View>
        </View>

        <View className="mt-6">
          <View className="flex-row justify-between mb-2">
            <Text
              className="text-xs text-dark-text-muted"
              style={{ fontFamily: "Nunito-Bold" }}
            >
              Progreso semanal
            </Text>
            <Text
              className="text-xs text-accent-cyan"
              style={{ fontFamily: "Nunito-Bold" }}
            >
              {progressPercentage}%
            </Text>
          </View>
          <ProgressBar progress={progressPercentage} />
        </View>
      </Card>
    </View>
  );
}
