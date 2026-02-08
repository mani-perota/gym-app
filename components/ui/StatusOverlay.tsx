import { View, Text, StyleSheet } from "react-native";
import { Check, X, Info } from "lucide-react-native";
import Animated, {
    FadeIn,
    FadeOut,
    ZoomIn,
    ZoomOut,
    Layout,
    EntryExitTransition
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Loader } from "./Loader";
import { DARK_COLORS } from "@/constants/Colors";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export type StatusType = "loading" | "success" | "error" | "info";

interface StatusOverlayProps {
    isVisible: boolean;
    type?: StatusType;
    message?: string;
    onAnimationComplete?: () => void;
}

/**
 * Overlay de estado premium para toda la aplicación.
 * Proporciona retroalimentación visual profesional con Blur y animaciones suaves.
 */
export function StatusOverlay({
    isVisible,
    type = "loading",
    message,
    onAnimationComplete
}: StatusOverlayProps) {
    if (!isVisible) return null;

    const getIcon = () => {
        switch (type) {
            case "success":
                return <Check size={48} color={DARK_COLORS.emerald} strokeWidth={3} />;
            case "error":
                return <X size={48} color={DARK_COLORS.rose} strokeWidth={3} />;
            case "info":
                return <Info size={48} color={DARK_COLORS.cyan} strokeWidth={3} />;
            case "loading":
                return <Loader size="md" message={message || "Cargando..."} />;
            default:
                return <Loader size="md" message={message || "Cargando..."} />;
        }
    };

    const getGlowColor = () => {
        switch (type) {
            case "success": return DARK_COLORS.emerald;
            case "error": return DARK_COLORS.rose;
            case "info": return DARK_COLORS.cyan;
            default: return DARK_COLORS.cyan;
        }
    };

    return (
        <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={[StyleSheet.absoluteFill, { zIndex: 9999, alignItems: 'center', justifyContent: 'center' }]}
        >
            <BlurView
                intensity={20}
                tint="dark"
                style={StyleSheet.absoluteFill}
            />

            {/* Fondo oscuro semi-transparente adicional para profundidad */}
            <View
                style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 15, 26, 0.7)' }]}
            />

            <Animated.View
                entering={ZoomIn.springify().damping(15)}
                exiting={ZoomOut.duration(200)}
                className="items-center justify-center p-8 rounded-3xl"
                style={{
                    backgroundColor: DARK_COLORS.surface,
                    shadowColor: getGlowColor(),
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    elevation: 10,
                }}
            >
                {type === 'loading' ? (
                    getIcon()
                ) : (
                    <>
                        <Animated.View
                            entering={ZoomIn.duration(400)}
                            className="w-24 h-24 rounded-full items-center justify-center mb-6"
                            style={{
                                backgroundColor: "rgba(255,255,255,0.03)",
                            }}
                        >
                            {getIcon()}
                        </Animated.View>
                        {message && (
                            <Text
                                className="text-center text-lg font-bold tracking-tight"
                                style={{
                                    fontFamily: "Quicksand-Bold",
                                    color: DARK_COLORS.text,
                                    maxWidth: 200
                                }}
                            >
                                {message}
                            </Text>
                        )}
                    </>
                )}
            </Animated.View>
        </Animated.View>
    );
}
