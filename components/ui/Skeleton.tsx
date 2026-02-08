import { useEffect } from "react";
import { View, StyleSheet, Dimensions, ViewStyle, DimensionValue } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { DARK_COLORS } from "@/constants/Colors";

interface SkeletonProps {
    width?: DimensionValue;
    height?: DimensionValue;
    borderRadius?: number;
    style?: ViewStyle;
}

export function Skeleton({
    width = "100%",
    height = 20,
    borderRadius = 8,
    style,
}: SkeletonProps) {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: DARK_COLORS.surface,
                    overflow: "hidden",
                },
                style,
                animatedStyle,
            ]}
        >
            <LinearGradient
                colors={[DARK_COLORS.surface, DARK_COLORS.elevated, DARK_COLORS.surface]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
            />
        </Animated.View>
    );
}
