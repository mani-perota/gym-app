import { View, Text, Pressable, Alert } from "react-native";
import { Dumbbell, HeartPulse, Sparkles, Pencil, Trash2 } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { DARK_COLORS, SHADOWS } from "@/constants/Colors";
import type { AccentColor } from "@/types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Mapeo de nombres de iconos a componentes */
const ICON_MAP = {
  dumbbell: Dumbbell,
  "heart-pulse": HeartPulse,
  sparkles: Sparkles,
} as const;

interface ActivityItemProps {
  title: string;
  subtitle: string;
  iconName: keyof typeof ICON_MAP;
  value: string;
  timestamp: string;
  accentColor: AccentColor;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

/**
 * Item de actividad con diseño dark premium.
 * Incluye botones de editar y eliminar.
 */
export function ActivityItem({
  title,
  subtitle,
  iconName,
  value,
  timestamp,
  accentColor,
  onPress,
  onEdit,
  onDelete,
}: ActivityItemProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const IconComponent = ICON_MAP[iconName];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar entrenamiento",
      "¿Estás seguro de que deseas eliminar este entrenamiento? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            opacity.value = withTiming(0, { duration: 200 }, (finished) => {
              if (finished && onDelete) {
                runOnJS(onDelete)();
              }
            });
          },
        },
      ]
    );
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, SHADOWS.soft]}
      className="bg-dark-surface/80 p-5 rounded-2xl border border-white/5"
    >
      {/* Contenido principal */}
      <View className="flex-row items-start gap-4">
        {/* Icono con fondo sutil */}
        <View className="w-12 h-12 rounded-xl bg-accent-violet/20 items-center justify-center">
          <IconComponent size={22} color={DARK_COLORS.violet} strokeWidth={2} />
        </View>

        {/* Información */}
        <View className="flex-1">
          <Text
            className="text-dark-text text-base"
            style={{ fontFamily: "Quicksand-Bold" }}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            className="text-sm text-dark-text-muted mt-0.5"
            style={{ fontFamily: "Nunito" }}
          >
            {subtitle}
          </Text>
        </View>

        {/* Valor y timestamp */}
        <View className="items-end">
          <Text
            className="text-dark-text-secondary text-sm"
            style={{ fontFamily: "Nunito-Bold" }}
          >
            {value}
          </Text>
          <Text
            className="text-xs text-dark-text-muted mt-0.5"
            style={{ fontFamily: "Nunito" }}
          >
            {timestamp}
          </Text>
        </View>
      </View>

      {/* Botones de acción */}
      {(onEdit || onDelete) && (
        <View className="flex-row justify-end gap-2 mt-4 pt-3 border-t border-white/5">
          {onEdit && (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex-row items-center gap-1.5 px-3 py-2 rounded-lg bg-accent-cyan/20"
            >
              <Pencil size={14} color={DARK_COLORS.cyan} strokeWidth={2} />
              <Text
                className="text-xs text-accent-cyan"
                style={{ fontFamily: "Nunito-Bold" }}
              >
                Editar
              </Text>
            </Pressable>
          )}
          {onDelete && (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="flex-row items-center gap-1.5 px-3 py-2 rounded-lg bg-accent-rose/20"
            >
              <Trash2 size={14} color={DARK_COLORS.rose} strokeWidth={2} />
              <Text
                className="text-xs text-accent-rose"
                style={{ fontFamily: "Nunito-Bold" }}
              >
                Eliminar
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </AnimatedPressable>
  );
}
