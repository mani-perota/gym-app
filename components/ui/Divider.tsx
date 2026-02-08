import { View, Text, StyleSheet } from "react-native";
import { DARK_COLORS } from "@/constants/Colors";

interface DividerProps {
  text?: string;
}

/**
 * Divider - Línea divisora con texto opcional
 * Diseño dark premium
 */
export function Divider({ text }: DividerProps) {
  if (!text) {
    return <View style={styles.line} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: DARK_COLORS.border,
  },
  text: {
    marginHorizontal: 16,
    color: DARK_COLORS.textMuted,
    fontSize: 11,
    fontFamily: "Nunito-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
});
