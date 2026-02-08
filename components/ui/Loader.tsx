import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    cancelAnimation,
    withSpring,
} from "react-native-reanimated";
import Svg, { Circle, LinearGradient, Stop, Defs } from "react-native-svg";
import { DARK_COLORS } from "@/constants/Colors";

interface LoaderProps {
    text?: string;
    description?: string;
    // Backward compatibility if needed, though we prefer text/description
    message?: string;
    size?: "sm" | "md" | "lg";
}

export function Loader({ text, description, message, size = "md" }: LoaderProps) {
    const rotation = useSharedValue(0);

    // Determine sizes based on prop
    const sizeMap = {
        sm: {
            container: 40,
            strokeWidth: 3,
            radius: 16,
        },
        md: {
            container: 80,
            strokeWidth: 4,
            radius: 36,
        },
        lg: {
            container: 120,
            strokeWidth: 5,
            radius: 54,
        },
    };

    const { container, strokeWidth, radius } = sizeMap[size];
    const circumference = 2 * Math.PI * radius;
    // We want a gap in the circle (e.g. 25% gap)
    const strokeDasharray = `${circumference * 0.75} ${circumference}`;

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, { duration: 1500, easing: Easing.linear }),
            -1
        );
        return () => {
            cancelAnimation(rotation);
        };
    }, []);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [{ rotateZ: `${rotation.value}deg` }],
        };
    });

    const displayTitle = text || message || "Loading...";

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.spinnerContainer, { width: container, height: container }, animatedStyles]}>
                <Svg width={container} height={container} viewBox={`0 0 ${container} ${container}`}>
                    <Defs>
                        <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <Stop offset="0%" stopColor={DARK_COLORS.cyan} stopOpacity="1" />
                            <Stop offset="100%" stopColor={DARK_COLORS.cyan} stopOpacity="0.1" />
                        </LinearGradient>
                    </Defs>
                    {/* Background Track Circle */}
                    <Circle
                        cx={container / 2}
                        cy={container / 2}
                        r={radius}
                        stroke={DARK_COLORS.border}
                        strokeWidth={strokeWidth}
                        strokeOpacity={0.3}
                        fill="transparent"
                    />
                    {/* Animated Gradient Circle */}
                    <Circle
                        cx={container / 2}
                        cy={container / 2}
                        r={radius}
                        stroke="url(#gradient)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={strokeDasharray}
                        strokeLinecap="round"
                    />
                </Svg>
            </Animated.View>

            <View style={styles.textContainer}>
                <Text style={[styles.title, size === 'sm' && styles.titleSm]}>
                    {displayTitle}
                </Text>
                {description && (
                    <Text style={[styles.description, size === 'sm' && styles.descSm]}>
                        {description}
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    spinnerContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    textContainer: {
        marginTop: 24,
        alignItems: "center",
        gap: 8,
    },
    title: {
        color: DARK_COLORS.text,
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 0.5,
    },
    titleSm: {
        fontSize: 14,
    },
    description: {
        color: DARK_COLORS.textMuted,
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
    },
    descSm: {
        fontSize: 12,
    },
});
