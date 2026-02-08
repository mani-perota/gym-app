import { View, Text, Pressable, TextInput } from "react-native";
import { Plus, Clock, Edit2, Check } from "lucide-react-native";
import { DARK_COLORS } from "@/constants/Colors";
import { SetRow, SetData } from "./SetRow";

interface SetTableProps {
    exerciseName: string;
    equipmentName: string;
    sets: SetData[];
    notes: string;
    showNotes: boolean;
    onUpdateSet: (id: string, field: keyof SetData, value: any) => void;
    onRemoveSet: (id: string) => void;
    onToggleCompleted: (id: string) => void;
    onAddSet: () => void;
    onNotesChange: (text: string) => void;
    onToggleNotes: () => void;
}

export function SetTable({
    exerciseName,
    equipmentName,
    sets,
    notes,
    showNotes,
    onUpdateSet,
    onRemoveSet,
    onToggleCompleted,
    onAddSet,
    onNotesChange,
    onToggleNotes,
}: SetTableProps) {
    return (
        <View
            className="mb-4 overflow-hidden"
            style={{
                backgroundColor: DARK_COLORS.surface,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 16,
            }}
        >
            <View className="mb-4">
                <Text
                    className="text-lg"
                    style={{ fontFamily: "Nunito-Bold", color: DARK_COLORS.text }}
                >
                    {exerciseName}
                </Text>
                <Text
                    className="text-sm"
                    style={{ fontFamily: "Nunito-Regular", color: DARK_COLORS.textSecondary }}
                >
                    {equipmentName}
                </Text>
            </View>

            {/* Tabla de Sets */}
            <View className="mb-4">
                {/* Header */}
                <View
                    className="flex-row items-center mb-2"
                    style={{
                        paddingHorizontal: 10,
                    }}
                >
                    <View className="flex-[0.2]" />
                    <Text
                        className="text-xs uppercase tracking-wider flex-[0.5] text-center"
                        style={{ fontFamily: "Nunito-Bold", color: DARK_COLORS.textMuted }}
                    >
                        SET
                    </Text>
                    <Text
                        className="text-xs uppercase tracking-wider flex-1 text-center"
                        style={{ fontFamily: "Nunito-Bold", color: DARK_COLORS.textMuted }}
                    >
                        KG
                    </Text>
                    <Text
                        className="text-xs uppercase tracking-wider flex-1 text-center"
                        style={{ fontFamily: "Nunito-Bold", color: DARK_COLORS.textMuted }}
                    >
                        REPS
                    </Text>
                    <Text
                        className="text-xs uppercase tracking-wider flex-1 text-center"
                        style={{ fontFamily: "Nunito-Bold", color: DARK_COLORS.textMuted }}
                    >
                        RPE
                    </Text>
                    <View className="flex-[0.5] items-center justify-center">
                        <Check size={14} color={DARK_COLORS.textMuted} />
                    </View>
                </View>

                {/* Sets */}
                {sets.map((set) => (
                    <SetRow
                        key={set.id}
                        set={set}
                        onUpdate={onUpdateSet}
                        onRemove={onRemoveSet}
                        onToggleCompleted={onToggleCompleted}
                    />
                ))}
            </View>

            {/* Añadir Serie */}
            <Pressable
                onPress={onAddSet}
                className="flex-row items-center justify-center py-3 mb-4"
                style={{
                    borderWidth: 1,
                    borderColor: DARK_COLORS.cyan,
                    borderStyle: "dashed",
                    borderRadius: 12,
                    backgroundColor: "rgba(34, 211, 238, 0.05)",
                }}
            >
                <Plus size={18} color={DARK_COLORS.cyan} strokeWidth={2.5} />
                <Text
                    className="ml-2 text-sm"
                    style={{ fontFamily: "Nunito-SemiBold", color: DARK_COLORS.cyan }}
                >
                    Añadir Serie
                </Text>
            </Pressable>

            {/* Notas */}
            <Pressable
                onPress={onToggleNotes}
                className="flex-row items-center py-2"
            >
                <Edit2 size={14} color={DARK_COLORS.textMuted} strokeWidth={2} />
                <Text
                    className="ml-2 text-sm"
                    style={{ fontFamily: "Nunito-Regular", color: DARK_COLORS.textMuted }}
                >
                    {showNotes ? "Ocultar notas" : "Notas sobre el ejercicio..."}
                </Text>
            </Pressable>

            {showNotes && (
                <TextInput
                    value={notes}
                    onChangeText={onNotesChange}
                    placeholder="Escribe tus notas aquí..."
                    placeholderTextColor={DARK_COLORS.textPlaceholder}
                    multiline
                    numberOfLines={3}
                    className="mt-2 p-3"
                    style={{
                        backgroundColor: "rgba(255,255,255,0.03)",
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.08)",
                        fontFamily: "Nunito-Regular",
                        color: DARK_COLORS.text,
                        fontSize: 14,
                        minHeight: 80,
                        textAlignVertical: "top",
                    }}
                />
            )}
        </View>
    );
}
