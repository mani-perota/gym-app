import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";

interface GradientBackgroundProps {
  children: ReactNode;
}

/**
 * Componente de fondo con gradiente oscuro premium.
 * Crea un efecto de profundidad con transición de azul oscuro.
 */
export function GradientBackground({ children }: GradientBackgroundProps) {
  return (
    <View className="flex-1 bg-dark-bg">
      <LinearGradient
        colors={["#0A0F1A", "#111827", "#0A0F1A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />
      {/* Subtle glow accent at top */}
      <View
        className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-20"
        style={{ backgroundColor: '#22D3EE' }}
      />
      <View
        className="absolute -bottom-48 -left-24 w-72 h-72 rounded-full opacity-10"
        style={{ backgroundColor: '#A78BFA' }}
      />
      <View className="flex-1 relative">
        {children}
      </View>
    </View>
  );
}
