import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react-native";

import { useAuth } from "@/hooks/useAuth";
import { Input, Button, SocialButton, Divider } from "@/components/ui";
import { DARK_COLORS } from "@/constants/Colors";

/**
 * Pantalla de registro - Diseño dark premium
 */
export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!nombre || !email || !password) return;

    clearError();
    const success = await register({ nombre, email, password });

    if (success) {
      router.replace("/(tabs)");
    }
  };

  const handleGoogleRegister = () => {
    console.log("Registro con Google");
  };

  const handleAppleRegister = () => {
    console.log("Registro con Apple");
  };

  const isFormValid = nombre && email && password && password.length >= 6;

  return (
    <View style={styles.container}>
      {/* Fondo con gradiente sutil */}
      <LinearGradient
        colors={[DARK_COLORS.bg, "#0F172A", DARK_COLORS.bg]}
        style={StyleSheet.absoluteFill}
      />

      {/* Decoración de glow sutil */}
      <View style={styles.glowViolet} />
      <View style={styles.glowEmerald} />

      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header con icono */}
            <Animated.View
              entering={FadeInDown.delay(100).duration(600)}
              style={styles.header}
            >
              {/* Icono */}
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={[DARK_COLORS.violet, DARK_COLORS.rose]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.logoGradient}
                >
                  <Sparkles size={32} color="#FFFFFF" strokeWidth={2.5} />
                </LinearGradient>
              </View>

              <Text style={styles.title}>
                Crea tu{"\n"}cuenta
              </Text>
              <Text style={styles.subtitle}>
                Comienza tu viaje fitness hoy mismo.
              </Text>
            </Animated.View>

            {/* Formulario */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(600)}
              style={styles.form}
            >
              <Input
                label="Nombre"
                icon={User}
                placeholder="Tu nombre"
                value={nombre}
                onChangeText={setNombre}
                autoCapitalize="words"
                autoComplete="name"
              />

              <Input
                label="Correo electrónico"
                icon={Mail}
                placeholder="hola@ejemplo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <Input
                label="Contraseña"
                icon={Lock}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChangeText={setPassword}
                isPassword
                autoComplete="password-new"
              />
            </Animated.View>

            {/* Mensaje de error */}
            {error && (
              <Animated.View
                entering={FadeInDown.duration(300)}
                style={styles.errorContainer}
              >
                <Text style={styles.errorText}>{error}</Text>
              </Animated.View>
            )}

            {/* Botón principal */}
            <Animated.View
              entering={FadeInDown.delay(400).duration(600)}
              style={styles.buttonContainer}
            >
              <Button
                variant="primary"
                size="lg"
                iconRight={ArrowRight}
                onPress={handleRegister}
                isLoading={isLoading}
                disabled={!isFormValid}
                fullWidth
              >
                Crear cuenta
              </Button>
            </Animated.View>

            {/* Separador */}
            <Animated.View entering={FadeInDown.delay(500).duration(600)}>
              <Divider text="O continúa con" />
            </Animated.View>

            {/* Botones sociales */}
            <Animated.View
              entering={FadeInDown.delay(600).duration(600)}
              style={styles.socialButtons}
            >
              <SocialButton provider="google" onPress={handleGoogleRegister}>
                Continuar con Google
              </SocialButton>

              <SocialButton provider="apple" onPress={handleAppleRegister}>
                Continuar con Apple
              </SocialButton>
            </Animated.View>

            {/* Link a login */}
            <Animated.View
              entering={FadeInUp.delay(700).duration(600)}
              style={styles.footer}
            >
              <View style={styles.footerRow}>
                <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
                <Link href="/(auth)/login" asChild>
                  <Pressable>
                    <Text style={styles.footerLink}>Inicia sesión</Text>
                  </Pressable>
                </Link>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_COLORS.bg,
  },
  flex: {
    flex: 1,
  },
  glowViolet: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: DARK_COLORS.violet,
    opacity: 0.08,
  },
  glowEmerald: {
    position: "absolute",
    bottom: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: DARK_COLORS.emerald,
    opacity: 0.08,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 36,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: DARK_COLORS.violet,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 34,
    fontFamily: "Quicksand-Bold",
    color: DARK_COLORS.text,
    textAlign: "center",
    lineHeight: 42,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Nunito",
    color: DARK_COLORS.textMuted,
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    gap: 16,
  },
  errorContainer: {
    marginTop: 16,
    backgroundColor: DARK_COLORS.errorLight,
    borderWidth: 1,
    borderColor: DARK_COLORS.error,
    borderRadius: 12,
    padding: 14,
  },
  errorText: {
    color: DARK_COLORS.error,
    textAlign: "center",
    fontFamily: "Nunito",
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 28,
  },
  socialButtons: {
    gap: 12,
  },
  footer: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 16,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    color: DARK_COLORS.textMuted,
    fontFamily: "Nunito",
    fontSize: 14,
  },
  footerLink: {
    color: DARK_COLORS.cyan,
    fontFamily: "Quicksand-Bold",
    fontSize: 14,
  },
});
