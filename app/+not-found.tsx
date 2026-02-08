import { Link, Stack } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Home } from "lucide-react-native";
import { GradientBackground } from "@/components/ui";
import { PASTEL_COLORS } from "@/constants/Colors";

/**
 * Pantalla 404 - Se muestra cuando la ruta no existe.
 */
export default function NotFoundScreen() {
  return (
    <GradientBackground>
      <Stack.Screen options={{ title: "¡Oops!", headerShown: false }} />
      <SafeAreaView className="flex-1 items-center justify-center px-6">
        <View className="w-24 h-24 rounded-full bg-pastel-pink/40 items-center justify-center mb-6">
          <Text className="text-5xl">🤔</Text>
        </View>

        <Text
          className="text-2xl text-pastel-text text-center mb-2"
          style={{ fontFamily: "Quicksand-Bold" }}
        >
          Página no encontrada
        </Text>

        <Text
          className="text-pastel-text/60 text-center mb-8"
          style={{ fontFamily: "Nunito" }}
        >
          Esta pantalla no existe en la aplicación
        </Text>

        <Link href="/" asChild>
          <Pressable className="flex-row items-center gap-2 bg-pastel-blue/50 px-6 py-3 rounded-full">
            <Home size={20} color={PASTEL_COLORS.blueDark} />
            <Text
              className="text-pastel-blue-dark"
              style={{ fontFamily: "Nunito-Bold" }}
            >
              Volver al inicio
            </Text>
          </Pressable>
        </Link>
      </SafeAreaView>
    </GradientBackground>
  );
}
