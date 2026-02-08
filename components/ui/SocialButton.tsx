import { type ReactNode } from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { DARK_COLORS, SHADOWS } from "@/constants/Colors";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type SocialProvider = "google" | "apple";

interface SocialButtonProps {
  provider: SocialProvider;
  children: string;
  onPress?: () => void;
  disabled?: boolean;
}

function GoogleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </Svg>
  );
}

function AppleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="#FFFFFF">
      <Path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74s2.57-.99 3.87-.82c1.31.17 2.28.69 2.53.79-.1.05-2.4 1.76-1.95 5.56.09.83.6 1.84 1.49 2.25-.37 1.34-.84 2.62-1.02 4.45zm-3.01-16.14c.73-.83 1.25-1.99.98-3.14-1.28.16-2.58.91-3.22 1.84-.71.97-1.12 2.03-.99 3.19 1.4.15 2.55-.92 3.23-1.89z" />
    </Svg>
  );
}

const providerIcons: Record<SocialProvider, () => ReactNode> = {
  google: GoogleIcon,
  apple: AppleIcon,
};

/**
 * SocialButton - Botón para autenticación social (Google/Apple)
 * Diseño dark premium
 */
export function SocialButton({
  provider,
  children,
  onPress,
  disabled = false,
}: SocialButtonProps) {
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

  const Icon = providerIcons[provider];

  return (
    <AnimatedPressable
      style={[
        styles.button,
        SHADOWS.soft,
        disabled && styles.disabled,
        animatedStyle,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <Icon />
      <Text style={styles.text}>{children}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: DARK_COLORS.surface,
    borderWidth: 1,
    borderColor: DARK_COLORS.border,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  text: {
    color: DARK_COLORS.text,
    fontFamily: "Quicksand-Bold",
    fontSize: 15,
  },
  disabled: {
    opacity: 0.6,
  },
});
