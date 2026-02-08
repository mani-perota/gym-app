import { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    Pressable,
    Modal,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { X, Save, Trash2, Dumbbell, Target, Zap, Weight } from "lucide-react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { ExerciseAutocomplete } from "@/components/ui";
import { DARK_COLORS, SHADOWS } from "@/constants/Colors";
import { MUSCLE_GROUP_LABELS, EQUIPMENT_LABELS, DIFFICULTY_LABELS } from "@/services/exercises";
import type { Workout, WorkoutSet, Exercise } from "@/types";

const AnimatedView = Animated.createAnimatedComponent(View);

interface WorkoutEditorProps {
    visible: boolean;
    workout: Workout | null;
    onClose: () => void;
    onSave: (ejercicios: WorkoutSet[]) => Promise<void>;
    isLoading?: boolean;
}

interface EditableExercise extends WorkoutSet {
    nombreEjercicio?: string;
    isEditing?: boolean;
}



/**
 * Modal para editar los ejercicios de un workout existente.
 * Diseño dark premium.
 */
export function WorkoutEditor({
    visible,
    workout,
    onClose,
    onSave,
    isLoading = false,
}: WorkoutEditorProps) {
    const [ejercicios, setEjercicios] = useState<EditableExercise[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (workout) {
            setEjercicios(workout.ejercicios.map((ej) => ({
                ...ej,
                isEditing: false,
            })));
        }
    }, [workout]);

    const handleUpdateEjercicio = (
        index: number,
        field: keyof WorkoutSet,
        value: string | number
    ) => {
        setEjercicios((prev) =>
            prev.map((ej, i) => (i === index ? { ...ej, [field]: value } : ej))
        );
    };

    const handleChangeExercise = (index: number, exercise: Exercise | null) => {
        if (!exercise) return;

        setEjercicios((prev) =>
            prev.map((ej, i) =>
                i === index
                    ? {
                        ...ej,
                        ejercicioId: exercise.id || "",
                        ejercicio: exercise,
                        isEditing: false,
                    }
                    : ej
            )
        );
    };

    const handleToggleEditExercise = (index: number) => {
        setEjercicios((prev) =>
            prev.map((ej, i) => (i === index ? { ...ej, isEditing: !ej.isEditing } : ej))
        );
    };

    const handleRemoveEjercicio = (index: number) => {
        setEjercicios((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const cleanedEjercicios = ejercicios.map(({ isEditing, ...rest }) => rest);
            await onSave(cleanedEjercicios);
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    const hasChanges = () => {
        if (!workout) return false;
        const cleanedEjercicios = ejercicios.map(({ isEditing, ...rest }) => rest);
        return JSON.stringify(cleanedEjercicios) !== JSON.stringify(workout.ejercicios);
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View
                className="flex-1"
                style={{ backgroundColor: DARK_COLORS.bg }}
            >
                {/* Header */}
                <View
                    className="flex-row items-center justify-between px-5 py-4 border-b"
                    style={{
                        borderColor: DARK_COLORS.border,
                        backgroundColor: DARK_COLORS.surface,
                    }}
                >
                    <Pressable
                        onPress={onClose}
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: DARK_COLORS.roseGlow }}
                    >
                        <X size={20} color={DARK_COLORS.rose} strokeWidth={2.5} />
                    </Pressable>

                    <View className="flex-1 mx-4">
                        <Text
                            className="text-lg text-center"
                            style={{ fontFamily: "Quicksand-Bold", color: DARK_COLORS.text }}
                        >
                            Editar Entrenamiento
                        </Text>
                        <Text
                            className="text-xs text-center mt-0.5"
                            style={{
                                fontFamily: "Nunito",
                                color: DARK_COLORS.textSecondary,
                            }}
                        >
                            {workout?.nombre || "Sin nombre"} • {ejercicios.length} ejercicio{ejercicios.length !== 1 ? "s" : ""}
                        </Text>
                    </View>

                    <Pressable
                        onPress={handleSave}
                        disabled={!hasChanges() || isSaving}
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{
                            backgroundColor: hasChanges()
                                ? DARK_COLORS.cyanGlow
                                : DARK_COLORS.violetGlow,
                            opacity: hasChanges() ? 1 : 0.5,
                        }}
                    >
                        {isSaving ? (
                            <ActivityIndicator size="small" color={DARK_COLORS.cyan} />
                        ) : (
                            <Save
                                size={20}
                                color={hasChanges() ? DARK_COLORS.cyan : DARK_COLORS.violet}
                                strokeWidth={2.5}
                            />
                        )}
                    </Pressable>
                </View>

                {/* Content */}
                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color={DARK_COLORS.cyan} />
                        <Text
                            className="mt-4"
                            style={{ fontFamily: "Nunito", color: DARK_COLORS.textSecondary }}
                        >
                            Cargando ejercicios...
                        </Text>
                    </View>
                ) : (
                    <ScrollView
                        className="flex-1"
                        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {ejercicios.length === 0 ? (
                            <View className="items-center justify-center py-20">
                                <Dumbbell size={48} color={DARK_COLORS.cyan} strokeWidth={1.5} />
                                <Text
                                    className="text-center mt-4"
                                    style={{
                                        fontFamily: "Nunito",
                                        color: DARK_COLORS.textMuted,
                                    }}
                                >
                                    No hay ejercicios en este entrenamiento.
                                </Text>
                            </View>
                        ) : (
                            <View style={{ gap: 16 }}>
                                {ejercicios.map((ejercicio, index) => (
                                    <ExerciseEditorCard
                                        key={`${ejercicio.ejercicioId}-${index}`}
                                        ejercicio={ejercicio}
                                        index={index}
                                        onUpdate={(field, value) =>
                                            handleUpdateEjercicio(index, field, value)
                                        }
                                        onChangeExercise={(exercise) => handleChangeExercise(index, exercise)}
                                        onToggleEdit={() => handleToggleEditExercise(index)}
                                        onRemove={() => handleRemoveEjercicio(index)}
                                    />
                                ))}
                            </View>
                        )}
                    </ScrollView>
                )}
            </View>
        </Modal>
    );
}

interface ExerciseEditorCardProps {
    ejercicio: EditableExercise;
    index: number;
    onUpdate: (field: keyof WorkoutSet, value: string | number) => void;
    onChangeExercise: (exercise: Exercise) => void;
    onToggleEdit: () => void;
    onRemove: () => void;
}

/**
 * Card individual para editar un ejercicio dentro del workout.
 * Diseño dark premium con glassmorphism.
 */
function ExerciseEditorCard({
    ejercicio,
    index,
    onUpdate,
    onChangeExercise,
    onToggleEdit,
    onRemove,
}: ExerciseEditorCardProps) {
    const exercise = ejercicio.ejercicio;
    const muscleGroup = exercise?.grupoMuscular || "cuerpo_completo";

    const [exerciseName, setExerciseName] = useState(exercise?.nombre || "");

    return (
        <AnimatedView
            entering={FadeIn.delay(index * 50)}
            style={[
                SHADOWS.soft,
                {
                    backgroundColor: DARK_COLORS.surface,
                    borderRadius: 20,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.05)",
                },
            ]}
        >
            {/* Barra de acento */}
            <View style={{ height: 3, backgroundColor: DARK_COLORS.cyan, opacity: 0.6 }} />

            <View style={{ padding: 16 }}>
                {/* Header con nombre del ejercicio */}
                <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1 mr-3">
                        {ejercicio.isEditing ? (
                            <View className="mb-2">
                                <ExerciseAutocomplete
                                    value={exerciseName}
                                    onChangeText={setExerciseName}
                                    onSelectExercise={onChangeExercise}
                                    selectedExercise={exercise || null}
                                    placeholder="Buscar ejercicio..."
                                />
                            </View>
                        ) : (
                            <Pressable onPress={onToggleEdit}>
                                <Text
                                    className="text-lg mb-1"
                                    style={{ fontFamily: "Quicksand-Bold", color: DARK_COLORS.text }}
                                    numberOfLines={2}
                                >
                                    {exercise?.nombre || `Ejercicio #${index + 1}`}
                                </Text>
                            </Pressable>
                        )}

                        {/* Tags informativos */}
                        {exercise && !ejercicio.isEditing && (
                            <View className="flex-row flex-wrap" style={{ gap: 6 }}>
                                {/* Grupo muscular */}
                                <View
                                    className="flex-row items-center px-2 py-1 rounded-full"
                                    style={{ backgroundColor: DARK_COLORS.elevated }}
                                >
                                    <Target size={12} color={DARK_COLORS.textSecondary} strokeWidth={2} />
                                    <Text
                                        className="text-xs ml-1"
                                        style={{ fontFamily: "Quicksand-Bold", color: DARK_COLORS.textSecondary }}
                                    >
                                        {MUSCLE_GROUP_LABELS[muscleGroup]}
                                    </Text>
                                </View>

                                {/* Equipamiento */}
                                {exercise.equipamiento && (
                                    <View
                                        className="flex-row items-center px-2 py-1 rounded-full"
                                        style={{ backgroundColor: DARK_COLORS.elevated }}
                                    >
                                        <Dumbbell size={12} color={DARK_COLORS.textSecondary} strokeWidth={2} />
                                        <Text
                                            className="text-xs ml-1"
                                            style={{ fontFamily: "Quicksand-Bold", color: DARK_COLORS.textSecondary }}
                                        >
                                            {EQUIPMENT_LABELS[exercise.equipamiento]}
                                        </Text>
                                    </View>
                                )}

                                {/* Dificultad */}
                                {exercise.dificultad && (
                                    <View
                                        className="flex-row items-center px-2 py-1 rounded-full"
                                        style={{ backgroundColor: DARK_COLORS.elevated }}
                                    >
                                        <Zap size={12} color={DARK_COLORS.textSecondary} strokeWidth={2} />
                                        <Text
                                            className="text-xs ml-1"
                                            style={{ fontFamily: "Quicksand-Bold", color: DARK_COLORS.textSecondary }}
                                        >
                                            {DIFFICULTY_LABELS[exercise.dificultad]}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>

                    <Pressable
                        onPress={onRemove}
                        className="w-9 h-9 rounded-xl items-center justify-center"
                        style={{ backgroundColor: DARK_COLORS.roseGlow }}
                    >
                        <Trash2 size={16} color={DARK_COLORS.rose} strokeWidth={2.5} />
                    </Pressable>
                </View>

                {/* Controles numéricos */}
                <View
                    className="flex-row items-center justify-between"
                    style={{
                        backgroundColor: DARK_COLORS.bgAlt,
                        borderRadius: 16,
                        padding: 8,
                    }}
                >
                    {/* Series */}
                    <View className="flex-1 items-center">
                        <Text
                            className="text-xs uppercase tracking-wide mb-2"
                            style={{ fontFamily: "Quicksand-Bold", color: DARK_COLORS.textMuted }}
                        >
                            Series
                        </Text>
                        <View className="flex-row items-center">
                            <Pressable
                                onPress={() => onUpdate("series", Math.max(1, ejercicio.series - 1))}
                                className="w-8 h-8 rounded-full items-center justify-center"
                                style={{ backgroundColor: DARK_COLORS.violetGlow }}
                            >
                                <Text style={{ fontSize: 18, color: DARK_COLORS.violet, fontWeight: "bold" }}>−</Text>
                            </Pressable>
                            <Text
                                className="mx-1 text-xl"
                                style={{ fontFamily: "Quicksand-Bold", color: DARK_COLORS.text, minWidth: 24, textAlign: "center" }}
                            >
                                {ejercicio.series}
                            </Text>
                            <Pressable
                                onPress={() => onUpdate("series", ejercicio.series + 1)}
                                className="w-8 h-8 rounded-full items-center justify-center"
                                style={{ backgroundColor: DARK_COLORS.violetGlow }}
                            >
                                <Text style={{ fontSize: 18, color: DARK_COLORS.violet, fontWeight: "bold" }}>+</Text>
                            </Pressable>
                        </View>
                    </View>

                    <View style={{ width: 1, height: 40, backgroundColor: DARK_COLORS.border }} />

                    {/* Reps */}
                    <View className="flex-1 items-center">
                        <Text
                            className="text-xs uppercase tracking-wide mb-2"
                            style={{ fontFamily: "Quicksand-Bold", color: DARK_COLORS.textMuted }}
                        >
                            Reps
                        </Text>
                        <View className="flex-row items-center">
                            <Pressable
                                onPress={() => onUpdate("repeticiones", Math.max(1, ejercicio.repeticiones - 1))}
                                className="w-8 h-8 rounded-full items-center justify-center"
                                style={{ backgroundColor: DARK_COLORS.violetGlow }}
                            >
                                <Text style={{ fontSize: 18, color: DARK_COLORS.violet, fontWeight: "bold" }}>−</Text>
                            </Pressable>
                            <Text
                                className="mx-1 text-xl"
                                style={{ fontFamily: "Quicksand-Bold", color: DARK_COLORS.text, minWidth: 24, textAlign: "center" }}
                            >
                                {ejercicio.repeticiones}
                            </Text>
                            <Pressable
                                onPress={() => onUpdate("repeticiones", ejercicio.repeticiones + 1)}
                                className="w-8 h-8 rounded-full items-center justify-center"
                                style={{ backgroundColor: DARK_COLORS.violetGlow }}
                            >
                                <Text style={{ fontSize: 18, color: DARK_COLORS.violet, fontWeight: "bold" }}>+</Text>
                            </Pressable>
                        </View>
                    </View>

                    <View style={{ width: 1, height: 40, backgroundColor: DARK_COLORS.border }} />

                    {/* Peso */}
                    <View className="flex-1 items-center">
                        <Text
                            className="text-xs uppercase tracking-wide mb-2"
                            style={{ fontFamily: "Quicksand-Bold", color: DARK_COLORS.textMuted }}
                        >
                            Kg
                        </Text>
                        <View className="flex-row items-center">
                            <Pressable
                                onPress={() => onUpdate("peso", Math.max(0, (ejercicio.peso || 0) - 2.5))}
                                className="w-8 h-8 rounded-full items-center justify-center"
                                style={{ backgroundColor: DARK_COLORS.violetGlow }}
                            >
                                <Text style={{ fontSize: 18, color: DARK_COLORS.violet, fontWeight: "bold" }}>−</Text>
                            </Pressable>
                            <Text
                                className="mx-1 text-xl"
                                style={{ fontFamily: "Quicksand-Bold", color: DARK_COLORS.text, minWidth: 24, textAlign: "center" }}
                            >
                                {ejercicio.peso || 0}
                            </Text>
                            <Pressable
                                onPress={() => onUpdate("peso", (ejercicio.peso || 0) + 2.5)}
                                className="w-8 h-8 rounded-full items-center justify-center"
                                style={{ backgroundColor: DARK_COLORS.violetGlow }}
                            >
                                <Text style={{ fontSize: 18, color: DARK_COLORS.violet, fontWeight: "bold" }}>+</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* Volumen total */}
                <View
                    className="flex-row items-center justify-center mt-3 py-2 px-4 rounded-xl"
                    style={{ backgroundColor: DARK_COLORS.cyanGlow }}
                >
                    <Weight size={14} color={DARK_COLORS.cyan} strokeWidth={2} />
                    <Text
                        className="text-sm ml-2"
                        style={{ fontFamily: "Quicksand-Bold", color: DARK_COLORS.cyan }}
                    >
                        Volumen: {ejercicio.series * ejercicio.repeticiones * (ejercicio.peso || 0)} kg
                    </Text>
                </View>

                {/* Notas */}
                {ejercicio.notas && (
                    <View
                        className="mt-3 p-3 rounded-xl"
                        style={{ backgroundColor: DARK_COLORS.elevated }}
                    >
                        <Text
                            className="text-xs"
                            style={{ fontFamily: "Nunito", color: DARK_COLORS.textSecondary }}
                        >
                            📝 {ejercicio.notas}
                        </Text>
                    </View>
                )}
            </View>
        </AnimatedView>
    );
}
