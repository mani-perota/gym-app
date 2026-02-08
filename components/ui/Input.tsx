import { useState, forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  type TextInputProps,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { Eye, EyeOff, type LucideIcon } from "lucide-react-native";
import { DARK_COLORS } from "@/constants/Colors";
import { ANIMATION } from "@/constants/design";

const AnimatedView = Animated.createAnimatedComponent(View);

/**
 * Props del componente Input
 */
interface InputProps extends Omit<TextInputProps, "style"> {
  /** Label superior del input */
  label: string;
  /** Icono izquierdo (componente de lucide-react-native) */
  icon?: LucideIcon;
  /** Si es un campo de contraseña (muestra toggle de visibilidad) */
  isPassword?: boolean;
  /** Mensaje de error */
  error?: string;
  /** Tamaño del input */
  size?: "md" | "lg";
}

/**
 * Input - Componente de entrada de texto reutilizable
 * Diseño dark premium con bordes limpios
 */
export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      icon: Icon,
      isPassword = false,
      error,
      size = "md",
      ...textInputProps
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const focusProgress = useSharedValue(0);

    const handleFocus = () => {
      setIsFocused(true);
      focusProgress.value = withTiming(1, { duration: ANIMATION.fast });
    };

    const handleBlur = () => {
      setIsFocused(false);
      focusProgress.value = withTiming(0, { duration: ANIMATION.fast });
    };

    const containerAnimatedStyle = useAnimatedStyle(() => {
      const borderColor = interpolateColor(
        focusProgress.value,
        [0, 1],
        [DARK_COLORS.border, DARK_COLORS.cyan]
      );

      return { borderColor };
    });

    const iconSize = size === "lg" ? 22 : 20;
    const iconColor = isFocused ? DARK_COLORS.cyan : DARK_COLORS.textMuted;
    const hasError = !!error;

    return (
      <View style={styles.wrapper}>
        <AnimatedView
          style={[
            styles.container,
            containerAnimatedStyle,
            hasError && { borderColor: DARK_COLORS.error },
          ]}
        >
          {/* Label */}
          <Text
            style={[
              styles.label,
              { color: hasError ? DARK_COLORS.error : DARK_COLORS.cyan },
            ]}
          >
            {label}
          </Text>

          {/* Input Row */}
          <View style={styles.inputRow}>
            {Icon && (
              <Icon
                size={iconSize}
                color={hasError ? DARK_COLORS.error : iconColor}
                strokeWidth={2}
              />
            )}

            <TextInput
              ref={ref}
              {...textInputProps}
              secureTextEntry={isPassword && !showPassword}
              onFocus={(e) => {
                handleFocus();
                textInputProps.onFocus?.(e);
              }}
              onBlur={(e) => {
                handleBlur();
                textInputProps.onBlur?.(e);
              }}
              placeholderTextColor={DARK_COLORS.textMuted}
              style={[styles.input, Icon && { marginLeft: 12 }]}
            />

            {isPassword && (
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={12}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <Eye size={iconSize} color={DARK_COLORS.textMuted} strokeWidth={2} />
                ) : (
                  <EyeOff size={iconSize} color={DARK_COLORS.textMuted} strokeWidth={2} />
                )}
              </Pressable>
            )}
          </View>
        </AnimatedView>

        {hasError && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = "Input";

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  container: {
    backgroundColor: DARK_COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DARK_COLORS.border,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  label: {
    fontSize: 11,
    fontFamily: "Nunito-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 6,
    color: DARK_COLORS.cyan,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Nunito",
    color: DARK_COLORS.text,
    padding: 0,
  },
  eyeButton: {
    marginLeft: 8,
  },
  errorText: {
    color: DARK_COLORS.error,
    fontSize: 12,
    fontFamily: "Nunito",
    marginTop: 6,
    marginLeft: 4,
  },
});
