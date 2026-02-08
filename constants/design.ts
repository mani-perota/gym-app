/**
 * Design System - Dark Premium Theme
 * Constantes de diseño para el tema oscuro premium
 */

/** Escala de espaciado (en unidades de 4px) */
export const SPACING = {
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  lg: 16,
  /** 20px */
  xl: 20,
  /** 24px */
  "2xl": 24,
  /** 32px */
  "3xl": 32,
  /** 40px */
  "4xl": 40,
} as const;

/** Tamaños de iconos */
export const ICON_SIZE = {
  /** 16px - Para badges e indicadores */
  xs: 16,
  /** 18px - Para inputs compactos */
  sm: 18,
  /** 20px - Default para inputs */
  md: 20,
  /** 24px - Para botones grandes */
  lg: 24,
} as const;

/** Tamaños de fuente */
export const FONT_SIZE = {
  /** 10px - Labels, captions */
  xs: 10,
  /** 12px - Texto pequeño */
  sm: 12,
  /** 14px - Texto secundario */
  md: 14,
  /** 16px - Texto base */
  base: 16,
  /** 18px - Texto destacado */
  lg: 18,
  /** 20px - Subtítulos */
  xl: 20,
  /** 24px - Títulos */
  "2xl": 24,
  /** 32px - Títulos grandes */
  "3xl": 32,
  /** 36px - Headers */
  "4xl": 36,
} as const;

/** Radios de borde */
export const BORDER_RADIUS = {
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  lg: 16,
  /** 20px */
  xl: 20,
  /** 24px */
  "2xl": 24,
  /** 9999px - Full rounded */
  full: 9999,
} as const;

/** Alturas de componentes */
export const COMPONENT_HEIGHT = {
  /** 36px - Botones pequeños */
  sm: 36,
  /** 44px - Inputs y botones estándar */
  md: 44,
  /** 52px - Inputs y botones grandes */
  lg: 52,
  /** 56px - CTAs principales */
  xl: 56,
} as const;

/** Colores del sistema - Dark Premium Theme */
export const COLORS = {
  // Fondos oscuros
  background: "#0A0F1A",
  backgroundAlt: "#111827",
  surface: "#1E293B",
  elevated: "#283548",

  // Primarios - Cyan vibrante
  primary: "#22D3EE",
  primaryLight: "#67E8F9",
  primaryPale: "rgba(34, 211, 238, 0.15)",
  primaryDark: "#0891B2",

  // Texto
  textMain: "#F8FAFC",
  textSubtle: "#94A3B8",
  textMuted: "#64748B",
  textPlaceholder: "#475569",

  // Bordes
  border: "#334155",
  borderLight: "#1E293B",
  borderFocus: "#22D3EE",

  // Estados
  error: "#EF4444",
  errorLight: "rgba(239, 68, 68, 0.2)",
  success: "#22C55E",
  successLight: "rgba(34, 197, 94, 0.2)",

  // Acentos vibrantes
  cyan: "#22D3EE",
  cyanDark: "#0891B2",
  violet: "#A78BFA",
  violetDark: "#7C3AED",
  emerald: "#34D399",
  emeraldDark: "#059669",
  rose: "#FB7185",
  roseDark: "#E11D48",

  // Legacy aliases
  pastelBg: "#0A0F1A",
  pastelBlue: "rgba(34, 211, 238, 0.2)",
  pastelBlueDark: "#22D3EE",
  pastelPink: "rgba(251, 113, 133, 0.2)",
  pastelPinkDark: "#FB7185",
  pastelGreen: "rgba(52, 211, 153, 0.2)",
  pastelGreenDark: "#34D399",
} as const;

/** Configuración de sombras - Dark theme con glow */
export const SHADOWS = {
  /** Sombra suave para cards */
  soft: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  /** Sombra media para elementos elevados */
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  },
  /** Sombra glow cyan para CTAs */
  button: {
    shadowColor: "#22D3EE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  /** Sombra glow violet */
  glowViolet: {
    shadowColor: "#A78BFA",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;

/** Duraciones de animación (ms) */
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;
