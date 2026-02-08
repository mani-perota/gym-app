import { View, Text, Pressable, TextInput } from "react-native";
import { ArrowRight, Check, Trash2 } from "lucide-react-native";
import { DARK_COLORS } from "@/constants/Colors";

export interface SetData {
    id: string;
    set: number;
    kg: number;
    reps: number;
    rpe: number;
    completed: boolean;
}

interface SetRowProps {
    set: SetData;
    onUpdate: (id: string, field: keyof SetData, value: any) => void;
    onRemove: (id: string) => void;
    onToggleCompleted: (id: string) => void;
}

export function SetRow({ set, onUpdate, onRemove, onToggleCompleted }: SetRowProps) {
    return (
        <View
            className="flex-row items-center mb-2"
            style={{
                backgroundColor: set.completed
                    ? "rgba(34, 211, 238, 0.08)"
                    : "transparent",
                borderRadius: 12,
                padding: 10,
            }}
        >
            {/* Remove Button */}
            <Pressable
                onPress={() => onRemove(set.id)}
                className="flex-[0.2] items-center justify-center mr-2"
                hitSlop={10}
            >
                <Trash2 size={16} color={DARK_COLORS.textMuted} strokeWidth={2} />
            </Pressable>

            {/* Set Number */}
            <Text
                className="text-lg flex-[0.5] text-center"
                style={{
                    fontFamily: "Nunito-ExtraBold",
                    color: set.completed ? DARK_COLORS.cyan : DARK_COLORS.textSecondary,
                    fontSize: 16
                }}
            >
                {set.set}
            </Text>

            {/* KG Input */}
            <View className="flex-1 items-center">
                {set.completed ? (
                    <Text
                        className="text-base"
                        style={{ fontFamily: "Nunito-Bold", color: DARK_COLORS.text, fontSize: 17 }}
                    >
                        {set.kg}
                    </Text>
                ) : (
                    <TextInput
                        value={set.kg.toString()}
                        onChangeText={(text) => onUpdate(set.id, "kg", parseFloat(text) || 0)}
                        keyboardType="decimal-pad"
                        className="text-center px-0 py-2"
                        style={{
                            fontFamily: "Nunito-Bold",
                            color: DARK_COLORS.text,
                            fontSize: 18,
                            width: "100%",
                            maxWidth: 70,
                            backgroundColor: "rgba(255,255,255,0.05)",
                            borderRadius: 8,
                            borderWidth: 0,
                        }}
                    />
                )}
            </View>

            {/* REPS Input */}
            <View className="flex-1 items-center">
                {set.completed ? (
                    <Text
                        className="text-base"
                        style={{ fontFamily: "Nunito-Bold", color: DARK_COLORS.text, fontSize: 17 }}
                    >
                        {set.reps}
                    </Text>
                ) : (
                    <TextInput
                        value={set.reps.toString()}
                        onChangeText={(text) => onUpdate(set.id, "reps", parseInt(text) || 0)}
                        keyboardType="number-pad"
                        className="text-center px-0 py-2"
                        style={{
                            fontFamily: "Nunito-Bold",
                            color: DARK_COLORS.text,
                            fontSize: 18,
                            width: "100%",
                            maxWidth: 70,
                            backgroundColor: "rgba(255,255,255,0.05)",
                            borderRadius: 8,
                            borderWidth: 0,
                        }}
                    />
                )}
            </View>

            {/* RPE Input */}
            <View className="flex-1 items-center">
                <TextInput
                    value={set.rpe.toString()}
                    onChangeText={(text) => {
                        const val = parseInt(text) || 0;
                        if (val >= 0 && val <= 10) {
                            onUpdate(set.id, "rpe", val);
                        }
                    }}
                    keyboardType="number-pad"
                    className="text-center px-0 py-2"
                    editable={!set.completed}
                    style={{
                        fontFamily: "Nunito-Bold",
                        color: DARK_COLORS.text,
                        fontSize: 18,
                        width: "100%",
                        maxWidth: 70,
                        backgroundColor: set.completed ? "transparent" : "rgba(255,255,255,0.05)",
                        borderRadius: 8,
                        borderWidth: 0,
                    }}
                />
            </View>

            {/* Checkbox */}
            <Pressable
                onPress={() => onToggleCompleted(set.id)}
                className="flex-[0.5] items-center justify-center"
            >
                <View
                    className="w-8 h-8 rounded-lg items-center justify-center"
                    style={{
                        backgroundColor: set.completed
                            ? DARK_COLORS.cyan
                            : "rgba(255,255,255,0.1)",
                        borderWidth: 0,
                    }}
                >
                    {set.completed && <Check size={18} color={DARK_COLORS.bg} strokeWidth={3} />}
                </View>
            </Pressable>
        </View>
    );
}
