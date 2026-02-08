import { Text, Pressable, ActivityIndicator, View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { type LucideIcon } from "lucide-react-native";
import { COLORS, SHADOWS } from "@/constants/design";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconRight?: LucideIcon;
  iconLeft?: LucideIcon;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
}

const variantStyles = {
  primary: {
    backgroundColor: COLORS.primary,
    textColor: COLORS.background,
    iconColor: COLORS.background,
    borderWidth: 0,
    borderColor: "transparent",
    shadow: SHADOWS.button,
  },
  secondary: {
    backgroundColor: COLORS.surface,
    textColor: COLORS.textMain,
    iconColor: COLORS.cyan,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadow: SHADOWS.soft,
  },
  outline: {
    backgroundColor: "transparent",
    textColor: COLORS.textMain,
    iconColor: COLORS.textMain,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadow: undefined,
  },
  ghost: {
    backgroundColor: "transparent",
    textColor: COLORS.cyan,
    iconColor: COLORS.cyan,
    borderWidth: 0,
    borderColor: "transparent",
    shadow: undefined,
  },
};

const sizeStyles = {
  sm: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 14, iconSize: 16 },
  md: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 16, iconSize: 18 },
  lg: { paddingVertical: 16, paddingHorizontal: 24, fontSize: 18, iconSize: 20 },
};

/**
 * Button - Componente de botón con estilo dark premium
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  iconRight: IconRight,
  iconLeft: IconLeft,
  isLoading = false,
  disabled = false,
  fullWidth = false,
  onPress,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const variantConfig = variantStyles[variant];
  const sizeConfig = sizeStyles[size];
  const isDisabled = disabled || isLoading;

  return (
    <AnimatedPressable
      style={[
        styles.button,
        {
          backgroundColor: variantConfig.backgroundColor,
          paddingVertical: sizeConfig.paddingVertical,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          borderWidth: variantConfig.borderWidth || 0,
          borderColor: variantConfig.borderColor || "transparent",
        },
        variantConfig.shadow,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        animatedStyle,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={isDisabled}
    >
      {isLoading ? (
        <ActivityIndicator color={variantConfig.iconColor} size="small" />
      ) : (
        <View style={styles.content}>
          {IconLeft && (
            <IconLeft
              size={sizeConfig.iconSize}
              color={variantConfig.iconColor}
              strokeWidth={2.5}
            />
          )}
          <Text
            style={[
              styles.text,
              { color: variantConfig.textColor, fontSize: sizeConfig.fontSize },
            ]}
          >
            {children}
          </Text>
          {IconRight && (
            <IconRight
              size={sizeConfig.iconSize}
              color={variantConfig.iconColor}
              strokeWidth={2.5}
            />
          )}
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 9999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontFamily: "Quicksand-Bold",
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
});
