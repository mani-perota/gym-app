import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Dumbbell, Flame, Clock, ChevronLeft, ChevronRight } from "lucide-react-native";
import { DARK_COLORS } from "@/constants/Colors";

interface MonthlyWorkoutViewProps {
    currentDate: Date;
    data: any;
    onDayPress: (date: Date) => void;
    onMonthChange: (direction: 'prev' | 'next') => void;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const DAY_SIZE = (SCREEN_WIDTH - 32) / 7;

// Mapping of muscle groups to colors
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

export default function MonthlyWorkoutView({
    currentDate,
    data,
    onDayPress,
    onMonthChange
}: MonthlyWorkoutViewProps) {
    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    ).getDay();
    // Adjust so Monday is 0 (0=Sun, 1=Mon in JS usually, but we want Mon start)
    // JS: 0=Sun, 1=Mon, ..., 6=Sat
    // We want: 0=Mon, ..., 6=Sun
    const startDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const days = Array.from({ length: 42 }, (_, i) => {
        const dayNumber = i - startDayOffset + 1;
        const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;

        if (!isCurrentMonth) {
            // Calculate prev/next month dates for display if needed, 
            // but typically we just fade them out or show number
            const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
            const displayNum = dayNumber <= 0 ? prevMonthLastDay + dayNumber : dayNumber - daysInMonth;
            return {
                day: displayNum,
                isCurrentMonth: false,
                dateStr: null
            };
        }

        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
        // Manual formatting to avoid timezone offset issues with toISOString()
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${d}`;

        return { day: dayNumber, isCurrentMonth: true, dateStr };
    });


    // Find workout data for a specfic date string
    const getDayData = (dateStr: string | null) => {
        if (!data || !data.days || !dateStr) return null;
        return data.days.find((d: any) => d.date === dateStr);
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            today.getDate() === day &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear()
        );
    };

    return (
        <View className="flex-1 bg-background-dark">
            {/* Month Navigation Header handled by parent or here? 
          The parent has a header, but it controls the `currentDate`. 
          We might need to sync. for now parent handles 'Month' tab content.
      */}

            {/* Stats Cards */}
            <View className="px-4 pb-2">
                <View className="flex-row gap-3 overflow-hidden pb-2">
                    {/* Entrenos Card */}
                    <View className="flex-1 bg-card-dark p-3 rounded-xl border border-white/5 shadow-sm">
                        <View className="flex-row items-center gap-2 mb-1">
                            <Dumbbell size={16} color={DARK_COLORS.cyan} />
                            <Text className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                                Entrenos
                            </Text>
                        </View>
                        <Text className="text-2xl font-bold text-white">
                            {data?.days?.filter((d: any) => d.hasWorkout).length || 0}
                        </Text>
                    </View>

                    {/* Racha Card (Mock logic for now or needs backend) */}
                    <View className="flex-1 bg-card-dark p-3 rounded-xl border border-white/5 shadow-sm">
                        <View className="flex-row items-center gap-2 mb-1">
                            <Flame size={16} color={DARK_COLORS.rose} />
                            <Text className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                                Racha
                            </Text>
                        </View>
                        <Text className="text-2xl font-bold text-white">
                            5 <Text className="text-sm font-normal text-text-muted">días</Text>
                        </Text>
                    </View>

                    {/* Horas Card (Mock logic) */}
                    <View className="flex-1 bg-card-dark p-3 rounded-xl border border-white/5 shadow-sm">
                        <View className="flex-row items-center gap-2 mb-1">
                            <Clock size={16} color={DARK_COLORS.secondaryNeon} />
                            <Text className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                                Horas
                            </Text>
                        </View>
                        <Text className="text-2xl font-bold text-white">14h</Text>
                    </View>
                </View>
            </View>

            {/* Calendar Grid */}
            <View className="flex-1 px-4 py-2">
                {/* Weekday Headers */}
                <View className="flex-row mb-2">
                    {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                        <Text
                            key={day}
                            className="flex-1 text-center text-[10px] font-bold text-text-muted py-2 uppercase"
                        >
                            {day}
                        </Text>
                    ))}
                </View>

                {/* Days Grid */}
                <View className="flex-row flex-wrap">
                    {days.map((item, index) => {
                        const dayData = getDayData(item.dateStr);
                        const muscleGroups = dayData?.muscleGroups || [];

                        return (
                            <TouchableOpacity
                                key={index}
                                style={{ width: DAY_SIZE, height: 60 }}
                                className={`items-center justify-start py-1 rounded-lg relative ${!item.isCurrentMonth ? 'opacity-20' : ''}`}
                                onPress={() => item.isCurrentMonth && item.dateStr && onDayPress(new Date(item.dateStr))}
                                disabled={!item.isCurrentMonth}
                            >
                                {/* Selection/Today Highlight */}
                                {item.isCurrentMonth && isToday(item.day) && (
                                    <View className="absolute top-1 w-6 h-6 rounded-full bg-primary-neon/20 items-center justify-center -z-10 shadow-lg shadow-cyan-500/50" />
                                )}

                                <Text
                                    className={`text-sm font-medium mb-1 ${item.isCurrentMonth ? "text-white" : "text-text-muted"
                                        } ${item.isCurrentMonth && isToday(item.day) ? "font-bold text-primary-neon" : ""}`}
                                >
                                    {item.day}
                                </Text>

                                {/* Muscle Dots */}
                                {item.isCurrentMonth && muscleGroups.length > 0 && (
                                    <View className="flex-row gap-0.5 mt-1 flex-wrap justify-center max-w-[80%]">
                                        {muscleGroups.slice(0, 4).map((group: string, idx: number) => (
                                            <View
                                                key={idx}
                                                className="w-1.5 h-1.5 rounded-full"
                                                style={{
                                                    backgroundColor: getMuscleColor(group),
                                                    shadowColor: getMuscleColor(group),
                                                    shadowOffset: { width: 0, height: 0 },
                                                    shadowOpacity: 0.6,
                                                    shadowRadius: 5,
                                                    elevation: 3
                                                }}
                                            />
                                        ))}
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Muscle Legend */}
                <View className="mt-4 flex-row flex-wrap justify-center gap-4 py-4 border-t border-white/5">
                    {Object.entries({
                        Pecho: MUSCLE_COLORS.pecho,
                        Espalda: MUSCLE_COLORS.espalda,
                        Pierna: MUSCLE_COLORS.pierna,
                        Brazo: MUSCLE_COLORS.brazo,
                        Hombro: MUSCLE_COLORS.hombro
                    }).map(([name, color]) => (
                        <View key={name} className="flex-row items-center gap-2">
                            <View
                                className="w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: color,
                                    shadowColor: color,
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity: 0.6,
                                    shadowRadius: 5
                                }}
                            />
                            <Text className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                                {name}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}
