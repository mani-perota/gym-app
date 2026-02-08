import { Redirect } from "expo-router";

/**
 * Ruta index del grupo auth - redirige automáticamente a login
 */
export default function AuthIndex() {
  return <Redirect href="/(auth)/login" />;
}

