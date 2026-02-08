import { View, Text, Pressable } from "react-native";
import { Edit2 } from "lucide-react-native";
import { DARK_COLORS } from "@/constants/Colors";

interface ExerciseCardProps {
    id: string;
    nombre: string;
    grupoMuscular: string;
    series: number;
    onEdit?: () => void;
}

export function ExerciseCard({
    nombre,
    grupoMuscular,
    series,
    onEdit,
}: ExerciseCardProps) {
    return (
        <View
            className="overflow-hidden"
            style={{
                backgroundColor: DARK_COLORS.surface,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: 12,
                minWidth: 150,
            }}
        >
            <Text
                className="text-xs mb-1"
                style={{ fontFamily: "Nunito-SemiBold", color: DARK_COLORS.textMuted }}
            >
                {grupoMuscular}
            </Text>
            <Text
                className="text-base mb-2"
                style={{ fontFamily: "Nunito-Bold", color: DARK_COLORS.text }}
            >
                {nombre}
            </Text>
            <View className="flex-row items-center">
                <View className="w-1 h-1 rounded-full mr-2" style={{ backgroundColor: DARK_COLORS.cyan }} />
                <Text
                    className="text-xs"
                    style={{ fontFamily: "Nunito-Regular", color: DARK_COLORS.cyan }}
                >
                    {series} Series
                </Text>
                {onEdit && (
                    <Pressable className="ml-auto" onPress={onEdit}>
                        <Edit2 size={14} color={DARK_COLORS.textMuted} strokeWidth={2} />
                    </Pressable>
                )}
            </View>
        </View>
    );
}
