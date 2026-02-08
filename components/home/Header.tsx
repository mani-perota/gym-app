import { View, Text, Image, Pressable } from "react-native";
import { DARK_COLORS } from "@/constants/Colors";
import type { HeaderProps } from "@/types";

/**
 * Componente Header con saludo y foto de perfil.
 * Diseño dark premium con texto claro.
 */
export function Header({ user, greeting }: HeaderProps) {
  // Emoji basado en hora del día
  const emoji = greeting.includes("días") ? "☀️" : greeting.includes("tardes") ? "🌅" : "🌙";

  return (
    <View className="pt-12 pb-6 px-6 flex-row justify-between items-center">
      <View>
        <Text
          className="text-lg text-dark-text-muted"
          style={{ fontFamily: "Quicksand-Bold" }}
        >
          Hola, {user.name}
        </Text>
        <Text
          className="text-3xl text-dark-text mt-1"
          style={{ fontFamily: "Quicksand-Bold" }}
        >
          {greeting} {emoji}
        </Text>
      </View>
      <Pressable
        className="w-12 h-12 rounded-full overflow-hidden border-2"
        style={{ borderColor: DARK_COLORS.cyan + '40' }}
      >
        {user.avatarUrl ? (
          <Image
            source={{ uri: user.avatarUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View
            className="w-full h-full items-center justify-center"
            style={{ backgroundColor: DARK_COLORS.violetGlow }}
          >
            <Text
              className="text-dark-text text-lg"
              style={{ fontFamily: "Quicksand-Bold" }}
            >
              {user.name.charAt(0)}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}
