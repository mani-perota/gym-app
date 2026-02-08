import { View } from "react-native";
import type { ReactNode } from "react";
import { SHADOWS } from "@/constants/Colors";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glass" | "elevated";
}

/**
 * Componente Card base con estilo glassmorphism oscuro.
 * Diseño premium con fondo semi-transparente y borde sutil.
 */
export function Card({ children, className = "", variant = "default" }: CardProps) {
  const baseStyles = "rounded-2xl p-5";

  const variantStyles = {
    default: "bg-dark-surface/80 border border-white/5",
    glass: "bg-dark-surface/60 border border-white/10",
    elevated: "bg-dark-elevated border border-white/5",
  };

  return (
    <View
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={SHADOWS.soft}
    >
      {children}
    </View>
  );
}
