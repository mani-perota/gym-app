/** 
 * Dark Premium Color Palette
 * Tema oscuro moderno con acentos vibrantes
 */

/** Colores base del tema dark */
export const DARK_COLORS = {
  // Fondos
  bg: "#0A0F1A",
  bgAlt: "#111827",
  surface: "#1E293B",
  elevated: "#283548",

  // Texto
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  textPlaceholder: "#475569",

  // Bordes
  border: "#334155",
  borderSubtle: "#1E293B",
  borderFocus: "#22D3EE",

  // Acentos vibrantes
  cyan: "#22D3EE",
  cyanDark: "#0891B2",
  cyanGlow: "rgba(34, 211, 238, 0.3)",

  violet: "#A78BFA",
  violetDark: "#7C3AED",
  violetGlow: "rgba(167, 139, 250, 0.3)",

  emerald: "#34D399",
  emeraldDark: "#059669",
  emeraldGlow: "rgba(52, 211, 153, 0.3)",

  rose: "#FB7185",
  roseDark: "#E11D48",
  roseGlow: "rgba(251, 113, 133, 0.3)",

  amber: "#FBBF24",
  amberDark: "#D97706",

  // Neon User Design
  primaryNeon: "#00f2ff",
  secondaryNeon: "#bd00ff",
  primaryNeonGlow: "rgba(0, 242, 255, 0.4)",
  secondaryNeonGlow: "rgba(189, 0, 255, 0.4)",

  // Estados
  error: "#EF4444",
  errorLight: "rgba(239, 68, 68, 0.2)",
  success: "#22C55E",
  successLight: "rgba(34, 197, 94, 0.2)",

  // Legacy aliases for backward compatibility
  blue: "rgba(34, 211, 238, 0.2)",
  blueDark: "#22D3EE",
  pink: "rgba(251, 113, 133, 0.2)",
  pinkDark: "#FB7185",
  green: "rgba(52, 211, 153, 0.2)",
  greenDark: "#34D399",
  lavender: "rgba(167, 139, 250, 0.2)",
  lavenderDark: "#A78BFA",
  peach: "rgba(251, 146, 60, 0.2)",
  card: "#1E293B",
} as const;

/** Mapeo de colores de acento para componentes */
export const ACCENT_COLORS = {
  pink: {
    bg: DARK_COLORS.roseGlow,
    bgOpacity: "bg-rose-500/20",
    border: "border-rose-500/30",
    text: DARK_COLORS.rose,
    textClass: "text-rose-400",
  },
  blue: {
    bg: DARK_COLORS.cyanGlow,
    bgOpacity: "bg-cyan-500/20",
    border: "border-cyan-500/30",
    text: DARK_COLORS.cyan,
    textClass: "text-cyan-400",
  },
  green: {
    bg: DARK_COLORS.emeraldGlow,
    bgOpacity: "bg-emerald-500/20",
    border: "border-emerald-500/30",
    text: DARK_COLORS.emerald,
    textClass: "text-emerald-400",
  },
} as const;

/** Sombras para tema dark con glow */
export const SHADOWS = {
  soft: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  glow: {
    shadowColor: DARK_COLORS.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  glowViolet: {
    shadowColor: DARK_COLORS.violet,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;

// Legacy export para compatibilidad
export const PASTEL_COLORS = DARK_COLORS;
