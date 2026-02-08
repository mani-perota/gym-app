import React from "react";
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Dumbbell, Flame, Clock, Calendar } from "lucide-react-native";
import { DARK_COLORS } from "@/constants/Colors";

interface WeeklyWorkoutViewProps {
    currentDate: Date;
    data: any;
    onDayPress: (date: Date) => void;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

// Mapeo de grupos musculares a colores (duplicado por ahora, debería centralizarse)
const MUSCLE_COLORS: Record<string, string> = {
    pecho: DARK_COLORS.primaryNeon, // #00f2ff
    chest: DARK_COLORS.primaryNeon,
    pierna: DARK_COLORS.secondaryNeon, // #bd00ff
    legs: DARK_COLORS.secondaryNeon,
    gluteos: DARK_COLORS.secondaryNeon,
    brazo: DARK_COLORS.violet, // #A78BFA
    arms: DARK_COLORS.violet,
    biceps: DARK_COLORS.violet,
    triceps: DARK_COLORS.violet,
    espalda: DARK_COLORS.emerald, // #34D399
    back: DARK_COLORS.emerald,
    hombro: DARK_COLORS.cyan, // #22D3EE
    shoulders: DARK_COLORS.cyan,
    // Fallback
    default: DARK_COLORS.textSecondary,
};

const getMuscleColor = (group: string) => {
    const g = group?.toLowerCase() || "";
    for (const key in MUSCLE_COLORS) {
        if (g.includes(key)) return MUSCLE_COLORS[key];
    }
    return MUSCLE_COLORS.default;
};

export default function WeeklyWorkoutView({
    currentDate,
    data,
    onDayPress
}: WeeklyWorkoutViewProps) {
    // Calculate start and end of the week (Monday to Sunday)
    const getWeekRange = (date: Date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        const start = new Date(date.setDate(diff));
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            days.push(d);
        }
        return days;
    };

    const weekDays = getWeekRange(new Date(currentDate));

    // Find workout data for a specific date string
    const getDayData = (date: Date) => {
        if (!data || !data.days) return null;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${d}`;

        return data.days.find((item: any) => item.date === dateStr);
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return (
            today.getDate() === date.getDate() &&
            today.getMonth() === date.getMonth() &&
            today.getFullYear() === date.getFullYear()
        );
    };

    const isSelected = (date: Date) => {
        return (
            currentDate.getDate() === date.getDate() &&
            currentDate.getMonth() === date.getMonth() &&
            currentDate.getFullYear() === date.getFullYear()
        );
    };

    return (
        <ScrollView className="flex-1 bg-background-dark" contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Weekly Stats Summary (Mock/Real Data) */}
            <View className="px-4 py-4">
                <View className="flex-row gap-3">
                    <View className="flex-1 bg-card-dark p-4 rounded-2xl border border-white/5 shadow-sm">
                        <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
                            Volumen
                        </Text>
                        <Text className="text-2xl font-bold text-white">
                            {data?.totalVolume ? (data.totalVolume / 1000).toFixed(1) + 'k' : '0'}
                            <Text className="text-sm font-normal text-gray-500"> kg</Text>
                        </Text>
                    </View>
                    <View className="flex-1 bg-card-dark p-4 rounded-2xl border border-white/5 shadow-sm">
                        <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
                            Entrenos
                        </Text>
                        <Text className="text-2xl font-bold text-white">
                            {data?.days?.filter((d: any) => d.hasWorkout).length || 0}
                            <Text className="text-sm font-normal text-gray-500"> / 7</Text>
                        </Text>
                    </View>
                </View>
            </View>

            {/* Weekly Timeline */}
            <View className="px-4">
                <Text className="text-white font-bold text-lg mb-4">Esta Semana</Text>

                <View className="gap-3">
                    {weekDays.map((day, index) => {
                        const dayData = getDayData(day);
                        const hasWorkout = dayData?.hasWorkout;
                        const muscleGroups = dayData?.muscleGroups || [];
                        const isSelectedDay = isSelected(day);
                        const isTodayDay = isToday(day);

                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => onDayPress(day)}
                                activeOpacity={0.7}
                            >
                                <Animated.View
                                    entering={FadeInDown.delay(index * 50).springify()}
                                    className={`flex-row items-center p-4 rounded-2xl border ${isSelectedDay
                                        ? "bg-card-dark border-primary-neon/50"
                                        : "bg-card-dark border-white/5"
                                        }`}
                                >
                                    {/* Date Column */}
                                    <View className="w-14 items-center justify-center mr-4">
                                        <Text className={`text-xs font-medium uppercase mb-0.5 ${isSelectedDay || isTodayDay ? "text-primary-neon" : "text-gray-400"
                                            }`}>
                                            {day.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '')}
                                        </Text>
                                        <View className={`w-9 h-9 items-center justify-center rounded-full ${isSelectedDay || isTodayDay ? "bg-primary-neon/10" : "bg-white/5"
                                            }`}>
                                            <Text className={`text-lg font-bold ${isSelectedDay || isTodayDay ? "text-primary-neon" : "text-white"
                                                }`}>
                                                {day.getDate()}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Content Column */}
                                    <View className="flex-1">
                                        {hasWorkout ? (
                                            <View>
                                                <Text className="text-white font-bold text-base mb-1">
                                                    {dayData.workoutName || "Entrenamiento"}
                                                </Text>
                                                <View className="flex-row items-center gap-2">
                                                    {muscleGroups.slice(0, 3).map((group: string, idx: number) => (
                                                        <View key={idx} className="flex-row items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5">
                                                            <View
                                                                className="w-1.5 h-1.5 rounded-full"
                                                                style={{ backgroundColor: getMuscleColor(group) }}
                                                            />
                                                            <Text className="text-[10px] text-gray-300 capitalize">{group}</Text>
                                                        </View>
                                                    ))}
                                                    {muscleGroups.length > 3 && (
                                                        <Text className="text-xs text-gray-500">+{muscleGroups.length - 3}</Text>
                                                    )}
                                                </View>
                                            </View>
                                        ) : (
                                            <View className="flex-row items-center">
                                                <Text className="text-gray-500 italic text-sm">Descanso</Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Status Indicator */}
                                    <View className="w-6 items-end justify-center">
                                        {hasWorkout && (
                                            <View className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
                                        )}
                                    </View>
                                </Animated.View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
}
