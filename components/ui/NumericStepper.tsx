import { View, Text, TextInput, Pressable } from "react-native";
import { Plus, Minus } from "lucide-react-native";
import { DARK_COLORS } from "@/constants/Colors";

interface NumericStepperProps {
  value: string;
  onChange: (val: string) => void;
  label: string;
  suffix?: string;
  min?: number;
  step?: number;
  size?: "sm" | "md";
}

/**
 * Control numérico con botones de incremento/decremento.
 * Componente atómico reutilizable para inputs numéricos.
 */
export function NumericStepper({
  value,
  onChange,
  label,
  suffix,
  min = 0,
  step = 1,
  size = "md",
}: NumericStepperProps) {
  const numValue = parseFloat(value) || 0;
  const isSmall = size === "sm";

  const increment = () => onChange(String(numValue + step));
  const decrement = () => {
    const newVal = numValue - step;
    if (newVal >= min) onChange(String(newVal));
  };

  // Dimensiones según el tamaño
  const btnSize = isSmall ? 36 : 44;
  const iconSize = isSmall ? 14 : 18;
  const fontSize = isSmall ? 24 : 36;

  return (
    <View className="items-center w-full">
      <Text
        className="text-[10px] uppercase tracking-[2px] mb-3"
        style={{ fontFamily: "Nunito-Bold", color: DARK_COLORS.cyan }}
      >
        {label}
      </Text>

      <View className="flex-row items-center justify-between w-full">
        {/* Botón Menos */}
        <Pressable
          onPress={decrement}
          style={{
            width: btnSize,
            height: btnSize,
            backgroundColor: DARK_COLORS.elevated,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
          }}
          className="items-center justify-center active:opacity-70"
        >
          <Minus size={iconSize} color={DARK_COLORS.textSecondary} strokeWidth={2.5} />
        </Pressable>

        {/* Input Central */}
        <View className="mx-2 items-center justify-center flex-1">
          <TextInput
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
            className="text-center p-0"
            style={{
              fontFamily: "Quicksand-Bold",
              color: DARK_COLORS.text,
              fontSize: fontSize,
              minWidth: 50,
            }}
            placeholderTextColor={DARK_COLORS.textMuted}
          />
          {suffix && (
            <Text
              className="text-[9px] uppercase mt-0.5 tracking-widest"
              style={{ fontFamily: "Nunito-Bold", color: DARK_COLORS.textMuted }}
            >
              {suffix}
            </Text>
          )}
        </View>

        {/* Botón Más */}
        <Pressable
          onPress={increment}
          style={{
            width: btnSize,
            height: btnSize,
            backgroundColor: DARK_COLORS.cyanGlow,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: DARK_COLORS.cyan,
            shadowColor: DARK_COLORS.cyan,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 3,
          }}
          className="items-center justify-center active:opacity-80"
        >
          <Plus size={iconSize} color={DARK_COLORS.cyan} strokeWidth={2.5} />
        </Pressable>
      </View>
    </View>
  );
}

