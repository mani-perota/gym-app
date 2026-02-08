import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";

import "../global.css";
import { AuthProvider, useAuth } from "@/contexts";
import { Loader } from "@/components/ui/Loader";
import { View } from "react-native";
import { DARK_COLORS } from "@/constants/Colors";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    // Inter fonts with aliases for backward compatibility
    Inter: Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
    "Inter-ExtraBold": Inter_800ExtraBold,
    // Legacy aliases (mapped to Inter)
    Nunito: Inter_400Regular,
    "Nunito-SemiBold": Inter_600SemiBold,
    "Nunito-Bold": Inter_700Bold,
    "Nunito-ExtraBold": Inter_800ExtraBold,
    Quicksand: Inter_400Regular,
    "Quicksand-Medium": Inter_500Medium,
    "Quicksand-SemiBold": Inter_600SemiBold,
    "Quicksand-Bold": Inter_700Bold,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

/**
 * Hook para proteger las rutas según el estado de autenticación
 */
function useProtectedRoute(isAuthenticated: boolean, isLoading: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // No hacer nada mientras se verifica la autenticación
    if (isLoading) return;

    // Verificar si estamos en el grupo de auth
    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Si no está autenticado y no está en auth, redirigir a login
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Si está autenticado y está en auth, redirigir a tabs
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments, router]);
}

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();

  // Proteger las rutas según autenticación
  useProtectedRoute(isAuthenticated, isLoading);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: DARK_COLORS.bg, alignItems: "center", justifyContent: "center" }}>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="voice-input"
          options={{
            presentation: "modal",
            animation: "fade_from_bottom",
          }}
        />
      </Stack>
    </>
  );
}
