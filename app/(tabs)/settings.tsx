import { View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/ui";
import { Settings, User, LogOut, ChevronRight } from "lucide-react-native";
import { DARK_COLORS } from "@/constants/Colors";
import { useAuth } from "@/hooks";
import { useRouter } from "expo-router";

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  danger?: boolean;
}

/**
 * Componente de ítem de configuración - Diseño dark premium
 */
function SettingsItem({ icon, label, onPress, danger = false }: SettingsItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center rounded-2xl px-4 py-4 mb-3"
      style={{
        backgroundColor: DARK_COLORS.surface,
        borderWidth: 1,
        borderColor: danger ? DARK_COLORS.error : DARK_COLORS.border,
      }}
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{
          backgroundColor: danger ? DARK_COLORS.errorLight : DARK_COLORS.violetGlow,
        }}
      >
        {icon}
      </View>
      <Text
        className="flex-1 text-base"
        style={{
          fontFamily: "Nunito-SemiBold",
          color: danger ? DARK_COLORS.error : DARK_COLORS.text,
        }}
      >
        {label}
      </Text>
      <ChevronRight
        size={20}
        color={danger ? DARK_COLORS.error : DARK_COLORS.textMuted}
        strokeWidth={2}
      />
    </TouchableOpacity>
  );
}

/**
 * Pantalla de ajustes - Diseño dark premium
 */
export default function SettingsScreen() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("¿Estás seguro de que quieres cerrar sesión?");
      if (confirmed) {
        await logout();
        router.replace("/(auth)/login");
      }
    } else {
      Alert.alert(
        "Cerrar sesión",
        "¿Estás seguro de que quieres cerrar sesión?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Cerrar sesión",
            style: "destructive",
            onPress: async () => {
              await logout();
            },
          },
        ]
      );
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text
            className="text-2xl"
            style={{ fontFamily: "Quicksand-Bold", color: DARK_COLORS.text }}
          >
            Ajustes
          </Text>
        </View>

        {/* Perfil del usuario */}
        <View className="px-6 mb-6">
          <View
            className="rounded-3xl p-5 flex-row items-center"
            style={{
              backgroundColor: DARK_COLORS.surface,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.05)",
            }}
          >
            <View
              className="w-16 h-16 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: DARK_COLORS.cyanGlow }}
            >
              <User size={32} color={DARK_COLORS.cyan} />
            </View>
            <View className="flex-1">
              <Text
                className="text-lg"
                style={{ fontFamily: "Quicksand-Bold", color: DARK_COLORS.text }}
              >
                {user?.nombre || "Usuario"}
              </Text>
              <Text
                className="text-sm"
                style={{ fontFamily: "Nunito", color: DARK_COLORS.textMuted }}
              >
                {user?.email || "Sin correo"}
              </Text>
            </View>
          </View>
        </View>

        {/* Opciones de configuración */}
        <View className="px-6 flex-1">
          <Text
            className="text-xs uppercase tracking-wider mb-3 ml-1"
            style={{ fontFamily: "Nunito-Bold", color: DARK_COLORS.textMuted }}
          >
            Cuenta
          </Text>

          <SettingsItem
            icon={<Settings size={20} color={DARK_COLORS.violet} />}
            label="Preferencias"
            onPress={() => {
              if (Platform.OS === "web") {
                window.alert("Próximamente: Esta función estará disponible pronto");
              } else {
                Alert.alert("Próximamente", "Esta función estará disponible pronto");
              }
            }}
          />

          <View className="mt-6">
            <Text
              className="text-xs uppercase tracking-wider mb-3 ml-1"
              style={{ fontFamily: "Nunito-Bold", color: DARK_COLORS.textMuted }}
            >
              Sesión
            </Text>

            <SettingsItem
              icon={<LogOut size={20} color={DARK_COLORS.error} />}
              label="Cerrar sesión"
              onPress={handleLogout}
              danger
            />
          </View>
        </View>

        {/* Footer con versión */}
        <View className="px-6 pb-6">
          <Text
            className="text-center text-xs"
            style={{ fontFamily: "Nunito", color: DARK_COLORS.textMuted }}
          >
            Gym App v1.0.0
          </Text>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}
