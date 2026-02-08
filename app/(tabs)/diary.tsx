import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Calendar as CalendarIcon,
    Settings,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    MoreHorizontal,
    Circle,
    Dumbbell,
    Activity,
    User,
    BicepsFlexed,
    Footprints,
} from "lucide-react-native";
import WeeklyWorkoutView from "@/components/diary/WeeklyWorkoutView";
import MonthlyWorkoutView from "@/components/diary/MonthlyWorkoutView";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { workoutsService } from "@/services/api";
import { useFocusEffect } from "expo-router";

// Helper to get color by muscle group
const getExerciseColor = (group?: string) => {
    const g = group?.toLowerCase() || "";
    if (g.includes("pecho") || g.includes("chest")) return "#00f2ff"; // primary-neon
    if (g.includes("pierna") || g.includes("legs") || g.includes("gluteos")) return "#bd00ff"; // secondary-neon
    if (g.includes("hombro") || g.includes("shoulders")) return "#22D3EE";
    if (g.includes("espalda") || g.includes("back")) return "#34D399";
    if (g.includes("brazo") || g.includes("arms") || g.includes("biceps") || g.includes("triceps")) return "#A78BFA";
    return "#F472B6"; // default pinkish
};

// Helper to get icon by muscle group
const getExerciseIcon = (group?: string) => {
    const g = group?.toLowerCase() || "";
    if (g.includes("pierna") || g.includes("legs")) return Footprints; // Or Activity/Run
    if (g.includes("brazo") || g.includes("biceps")) return BicepsFlexed;
    if (g.includes("pecho") || g.includes("espalda")) return Dumbbell;
    return Activity;
};

export default function DiaryScreen() {
    const [activeTab, setActiveTab] = useState("Día");
    const [currentDate, setCurrentDate] = useState(new Date());

    const [isLoading, setIsLoading] = useState(true);
    const [summary, setSummary] = useState({ totalVolume: 0, totalSets: 0 });
    const [exercises, setExercises] = useState<any[]>([]);
    const [weeklyData, setWeeklyData] = useState<any>(null);
    const [monthlyData, setMonthlyData] = useState<any>(null);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
        });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const handlePrevDay = () => {
        const newDate = new Date(currentDate);
        if (activeTab === "Mes") {
            newDate.setMonth(currentDate.getMonth() - 1);
        } else {
            newDate.setDate(currentDate.getDate() - 1);
        }
        setCurrentDate(newDate);
    };

    const handleNextDay = () => {
        const newDate = new Date(currentDate);
        if (activeTab === "Mes") {
            newDate.setMonth(currentDate.getMonth() + 1);
        } else {
            newDate.setDate(currentDate.getDate() + 1);
        }
        setCurrentDate(newDate);
    };

    const fetchDailyWorkouts = useCallback(async () => {
        setIsLoading(true);
        try {
            // Format YYYY-MM-DD
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            const response = await workoutsService.getByDate(dateStr);

            setSummary(response.summary || { totalVolume: 0, totalSets: 0 });
            setExercises(response.exercises || []);
        } catch (error) {
            console.error("Error fetching daily workouts:", error);
            // Optional: show toast/alert
        } finally {
            setIsLoading(false);
        }
    }, [currentDate]);

    const fetchWeeklyWorkouts = useCallback(async () => {
        setIsLoading(true);
        try {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            const response = await workoutsService.getWeekly(dateStr);
            setWeeklyData(response);
        } catch (error) {
            console.error("Error fetching weekly workouts:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentDate]);

    const fetchMonthlyWorkouts = useCallback(async () => {
        setIsLoading(true);
        try {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0'); // Any day in month works, backend uses month of date
            const dateStr = `${year}-${month}-${day}`;

            const response = await workoutsService.getMonthly(dateStr);
            setMonthlyData(response);
        } catch (error) {
            console.error("Error fetching monthly workouts:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentDate]);

    useEffect(() => {
        if (activeTab === "Día") {
            fetchDailyWorkouts();
        } else if (activeTab === "Semana") {
            fetchWeeklyWorkouts();
        } else if (activeTab === "Mes") {
            fetchMonthlyWorkouts();
        }
    }, [fetchDailyWorkouts, fetchWeeklyWorkouts, fetchMonthlyWorkouts, activeTab]);

    // Refresh on focus
    useFocusEffect(
        useCallback(() => {
            if (activeTab === "Día") {
                fetchDailyWorkouts();
            } else if (activeTab === "Semana") {
                fetchWeeklyWorkouts();
            } else if (activeTab === "Mes") {
                fetchMonthlyWorkouts();
            }
        }, [fetchDailyWorkouts, fetchWeeklyWorkouts, fetchMonthlyWorkouts, activeTab])
    );

    const getHeaderDateText = () => {
        if (activeTab === "Mes") {
            return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        }
        return formatDate(currentDate);
    }

    // Handle switching to a specific day from month view
    const handleDayPressInMonth = (date: Date) => {
        setCurrentDate(date);
        setActiveTab("Día");
    };

    return (
        <SafeAreaView className="flex-1 bg-background-dark" edges={["top"]}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View className="px-4 pt-2 pb-4 bg-background-dark z-10">
                <View className="flex-row items-center justify-between mb-4">
                    <Text
                        className="text-3xl font-bold text-white"
                        style={{
                            textShadowColor: 'rgba(0, 242, 255, 0.5)',
                            textShadowOffset: { width: 0, height: 0 },
                            textShadowRadius: 10
                        }}
                    >
                        Diario
                    </Text>
                    <View className="flex-row gap-3">
                        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-card-dark">
                            <CalendarIcon size={20} color="#D1D5DB" />
                        </TouchableOpacity>
                        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-card-dark">
                            <Settings size={20} color="#D1D5DB" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tab Selector */}
                <View className="flex-row p-1 bg-card-dark rounded-xl mb-6 border border-white/5">
                    {["Día", "Semana", "Mes"].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={`flex-1 py-1.5 rounded-lg items-center justify-center ${activeTab === tab ? "bg-primary-neon" : ""
                                }`}
                        >
                            <Text
                                className={`text-sm font-semibold ${activeTab === tab ? "text-background-dark" : "text-gray-400"
                                    }`}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Date Navigator - Show in all views but content differs */}
                <View className="flex-row items-center justify-between mb-2">
                    <TouchableOpacity
                        onPress={handlePrevDay}
                        className="w-8 h-8 items-center justify-center rounded-full bg-transparent"
                    >
                        <ChevronLeft size={24} color="#9CA3AF" />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-0.5">
                            {activeTab === "Mes" ? "MES" : (isToday(currentDate) ? "HOY" : currentDate.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase())}
                        </Text>
                        <Text className="text-lg font-bold text-white uppercase">{getHeaderDateText()}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleNextDay}
                        className="w-8 h-8 items-center justify-center rounded-full bg-transparent"
                    >
                        <ChevronRight size={24} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Main Content */}
            {activeTab === "Semana" ? (
                <WeeklyWorkoutView currentDate={currentDate} data={weeklyData} onDayPress={setCurrentDate} />
            ) : activeTab === "Mes" ? (
                <MonthlyWorkoutView
                    currentDate={currentDate}
                    data={monthlyData}
                    onDayPress={handleDayPressInMonth}
                    onMonthChange={() => { }}
                />
            ) : (
                <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100 }}>
                    {isLoading ? (
                        <View className="mt-20 items-center justify-center">
                            <ActivityIndicator size="large" color="#00f2ff" />
                            <Text className="text-gray-400 mt-4">Cargando...</Text>
                        </View>
                    ) : (
                        <>
                            {/* Summary Card */}
                            <Animated.View
                                entering={FadeInDown.delay(100).springify()}
                                className="mb-6 rounded-2xl overflow-hidden border border-white/5 bg-card-dark shadow-lg"
                            >
                                <LinearGradient
                                    colors={["#0f1c2e", "#0a1320"]}
                                    className="p-5 flex-row justify-between items-center relative"
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    {/* Glow Effects */}
                                    <View className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary-neon/20 blur-xl" />
                                    <View className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-secondary-neon/20 blur-xl" />

                                    <View className="flex-1 z-10">
                                        <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
                                            Total Volume
                                        </Text>
                                        <View className="flex-row items-baseline gap-1">
                                            <Text
                                                className="text-3xl font-bold text-primary-neon"
                                                style={{
                                                    textShadowColor: "rgba(0, 242, 255, 0.5)",
                                                    textShadowOffset: { width: 0, height: 0 },
                                                    textShadowRadius: 10,
                                                }}
                                            >
                                                {summary.totalVolume.toLocaleString()}
                                            </Text>
                                            <Text className="text-sm font-medium text-gray-500">kg</Text>
                                        </View>
                                    </View>

                                    <View className="w-px h-12 bg-white/10 mx-4 z-10" />

                                    <View className="flex-1 items-end z-10">
                                        <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
                                            Total Series
                                        </Text>
                                        <View className="flex-row items-baseline justify-end gap-1">
                                            <Text
                                                className="text-3xl font-bold text-secondary-neon"
                                                style={{
                                                    textShadowColor: "rgba(189, 0, 255, 0.5)",
                                                    textShadowOffset: { width: 0, height: 0 },
                                                    textShadowRadius: 10,
                                                }}
                                            >
                                                {summary.totalSets}
                                            </Text>
                                            <Text className="text-sm font-medium text-gray-500">sets</Text>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </Animated.View>

                            {/* Exercises List */}
                            <View className="gap-4">
                                {exercises.length === 0 ? (
                                    <View className="items-center py-10">
                                        <Text className="text-gray-500">No hay ejercicios registrados este día.</Text>
                                    </View>
                                ) : (
                                    exercises.map((exercise, index) => {
                                        const color = getExerciseColor(exercise.group);
                                        const Icon = getExerciseIcon(exercise.group);

                                        return (
                                            <Animated.View
                                                key={exercise.id}
                                                entering={FadeInDown.delay(200 + index * 100).springify()}
                                                className="rounded-2xl bg-card-dark border border-white/5 overflow-hidden"
                                            >
                                                {/* Exercise Header */}
                                                <View className="p-4 flex-row items-center justify-between border-b border-white/5 bg-white/[0.02]">
                                                    <View className="flex-row items-center gap-3">
                                                        <View
                                                            className="w-10 h-10 rounded-xl items-center justify-center"
                                                            style={{ backgroundColor: `${color}20` }}
                                                        >
                                                            <Icon size={20} color={color} />
                                                        </View>
                                                        <View>
                                                            <Text className="font-bold text-base text-white">{exercise.name}</Text>
                                                            <Text className="text-xs" style={{ color: `${color}CC` }}>
                                                                {exercise.subtitle}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <TouchableOpacity>
                                                        <MoreHorizontal size={20} color="#6B7280" />
                                                    </TouchableOpacity>
                                                </View>

                                                {/* Sets Table Header */}
                                                <View className="flex-row px-4 py-2 gap-2">
                                                    <Text className="w-8 text-center text-[10px] font-semibold text-gray-500 uppercase">
                                                        #
                                                    </Text>
                                                    <Text className="flex-1 text-center text-[10px] font-semibold text-gray-500 uppercase">
                                                        kg
                                                    </Text>
                                                    <Text className="flex-1 text-center text-[10px] font-semibold text-gray-500 uppercase">
                                                        Reps
                                                    </Text>
                                                    <Text className="w-12 text-right text-[10px] font-semibold text-gray-500 uppercase pr-2">
                                                        Done
                                                    </Text>
                                                </View>

                                                {/* Sets List */}
                                                <View className="px-2 pb-2 gap-1">
                                                    {exercise.sets.map((set: any, sIndex: number) => (
                                                        <View
                                                            key={set.id}
                                                            className={`flex-row items-center px-2 py-2 rounded-lg ${set.completed ? "bg-background-dark/50" : "bg-background-dark/30"
                                                                } border border-transparent hover:border-white/5`}
                                                        >
                                                            <View className="w-8 items-center justify-center">
                                                                <View className="w-5 h-5 rounded items-center justify-center bg-white/5">
                                                                    <Text className="text-[10px] font-bold text-gray-400">
                                                                        {sIndex + 1}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <Text
                                                                className="flex-1 text-center font-bold"
                                                                style={{ color: color }}
                                                            >
                                                                {set.kg}
                                                            </Text>
                                                            <Text className="flex-1 text-center font-bold text-white">
                                                                {set.reps}
                                                            </Text>
                                                            <View className="w-12 items-end justify-center pr-2">
                                                                {set.completed ? (
                                                                    <CheckCircle size={16} color={color} />
                                                                ) : (
                                                                    <Circle size={16} color="#4B5563" />
                                                                )}
                                                            </View>
                                                        </View>
                                                    ))}
                                                </View>

                                                {/* Add Set Button */}
                                                <TouchableOpacity className="w-full py-2.5 border-t border-white/5 items-center bg-transparent active:bg-white/5">
                                                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        + Add Set
                                                    </Text>
                                                </TouchableOpacity>
                                            </Animated.View>
                                        );
                                    })
                                )}
                            </View>
                        </>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
