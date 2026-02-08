import { View, Text, Pressable } from "react-native";
import { LayoutDashboard, NotebookPen, BarChart3, User } from "lucide-react-native";
import { BlurView } from "expo-blur";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { DARK_COLORS } from "@/constants/Colors";

/** Configuración de los tabs */
const TAB_CONFIG = [
  { name: "index", label: "Inicio", icon: LayoutDashboard },
  { name: "diary", label: "Diario", icon: NotebookPen },
  { name: "spacer", label: "", icon: null }, // Espacio para el FAB
  { name: "reports", label: "Progreso", icon: BarChart3 },
  { name: "settings", label: "Perfil", icon: User },
] as const;

/**
 * Barra de navegación inferior con efecto blur oscuro.
 * Incluye espacio en el centro para el FAB.
 */
export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View className="absolute bottom-0 left-0 right-0 z-40">
      <BlurView
        intensity={80}
        tint="dark"
        className="flex-row justify-between items-center px-6 pt-4 pb-8 border-t border-white/5"
      >
        {TAB_CONFIG.map((tab) => {
          if (tab.name === "spacer") {
            return <View key="spacer" className="w-12" />;
          }

          const routeIndex = state.routes.findIndex(
            (route) => route.name === tab.name
          );
          const isFocused = routeIndex !== -1 && state.index === routeIndex;
          const IconComponent = tab.icon;

          const handlePress = () => {
            if (routeIndex === -1) return;
            const route = state.routes[routeIndex];
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={tab.name}
              onPress={handlePress}
              className="flex-col items-center gap-1"
            >
              {IconComponent && (
                <IconComponent
                  size={28}
                  color={
                    isFocused
                      ? DARK_COLORS.cyan
                      : DARK_COLORS.textMuted
                  }
                  strokeWidth={isFocused ? 2.5 : 2}
                />
              )}
              <Text
                className={`text-[10px] ${isFocused ? "text-accent-cyan" : "text-dark-text-muted"
                  }`}
                style={{ fontFamily: "Nunito-Bold" }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}
