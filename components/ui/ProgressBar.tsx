import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface ProgressBarProps {
  /** Porcentaje de progreso (0-100) */
  progress: number;
}

/**
 * Barra de progreso con gradiente cyan->violet premium.
 */
export function ProgressBar({ progress }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
      <View style={{ width: `${clampedProgress}%` }} className="h-full">
        <LinearGradient
          colors={["#22D3EE", "#A78BFA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="w-full h-full rounded-full"
        />
      </View>
    </View>
  );
}
