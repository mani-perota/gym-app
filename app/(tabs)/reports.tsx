import { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Path,
  G,
  Defs,
  LinearGradient,
  Stop,
  Line,
  Rect,
} from "react-native-svg";
import {
  Trophy,
  Dumbbell,
  ChevronDown,
  TrendingUp,
  Flame,
  Target,
  Award,
} from "lucide-react-native";
import { GradientBackground } from "@/components/ui";
import { useStats, useExercises } from "@/hooks";
import { PASTEL_COLORS } from "@/constants/Colors";
import type { ConsistencyData, MuscleDistribution, ProgressionData } from "@/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ============================================
// COLORES PARA GRÁFICOS
// ============================================
const CHART_COLORS = {
  emerald: ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0"],
  distribution: [
    "#818CF8", // Indigo
    "#F472B6", // Pink
    "#34D399", // Emerald
    "#FBBF24", // Amber
    "#60A5FA", // Blue
    "#A78BFA", // Purple
    "#FB923C", // Orange
    "#4ADE80", // Green
  ],
};

// ============================================
// COMPONENTE: HEADER
// ============================================
function ReportsHeader() {
  return (
    <View className="px-6 pt-4 pb-6">
      <Text
        className="text-3xl text-pastel-text"
        style={{ fontFamily: "Quicksand-Bold" }}
      >
        Mi Progreso
      </Text>
      <Text
        className="text-pastel-text/60 mt-1"
        style={{ fontFamily: "Nunito" }}
      >
        Visualiza tu evolución y logros
      </Text>
    </View>
  );
}

// ============================================
// COMPONENTE: HEATMAP DE CONSISTENCIA
// ============================================
interface ConsistencyHeatmapProps {
  data: ConsistencyData[];
  isLoading: boolean;
}

function ConsistencyHeatmap({ data, isLoading }: ConsistencyHeatmapProps) {
  // Asegurar que data sea un array válido
  const safeData = Array.isArray(data) ? data : [];

  const heatmapData = useMemo(() => {
    // Generar últimos 6 meses de datos
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const weeks: { date: Date; count: number }[][] = [];
    const dataMap = new Map(safeData.map((d) => [d.date, d.count]));

    let currentDate = new Date(sixMonthsAgo);
    // Ajustar al domingo más cercano
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());

    while (currentDate <= today) {
      const week: { date: Date; count: number }[] = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = currentDate.toISOString().split("T")[0];
        week.push({
          date: new Date(currentDate),
          count: dataMap.get(dateStr) || 0,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(week);
    }

    return weeks;
  }, [safeData]);

  const getOpacity = (count: number) => {
    if (count === 0) return 0.1;
    if (count === 1) return 0.3;
    if (count === 2) return 0.5;
    if (count === 3) return 0.7;
    return 1;
  };

  const months = useMemo(() => {
    const monthNames = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];
    const result: { name: string; position: number }[] = [];
    let lastMonth = -1;

    heatmapData.forEach((week, weekIndex) => {
      const month = week[0].date.getMonth();
      if (month !== lastMonth) {
        result.push({ name: monthNames[month], position: weekIndex });
        lastMonth = month;
      }
    });

    return result;
  }, [heatmapData]);

  const totalWorkouts = safeData.reduce((acc, d) => acc + d.count, 0);

  if (isLoading) {
    return (
      <View className="bg-white/80 rounded-3xl p-5 mx-6 mb-4">
        <ActivityIndicator color={PASTEL_COLORS.blueDark} />
      </View>
    );
  }

  return (
    <View className="bg-white/80 rounded-3xl p-5 mx-6 mb-4">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-2xl bg-emerald-100 items-center justify-center mr-3">
            <Flame size={20} color="#10B981" />
          </View>
          <View>
            <Text
              className="text-lg text-pastel-text"
              style={{ fontFamily: "Quicksand-Bold" }}
            >
              Consistencia
            </Text>
            <Text
              className="text-xs text-pastel-text/50"
              style={{ fontFamily: "Nunito" }}
            >
              Últimos 6 meses
            </Text>
          </View>
        </View>
        <View className="bg-emerald-100 px-3 py-1.5 rounded-full">
          <Text
            className="text-emerald-700 text-sm"
            style={{ fontFamily: "Nunito-Bold" }}
          >
            {totalWorkouts} sesiones
          </Text>
        </View>
      </View>

      {/* Meses */}
      <View className="flex-row mb-2 ml-2">
        {months.map((month, i) => (
          <Text
            key={i}
            className="text-[10px] text-pastel-text/50"
            style={{
              fontFamily: "Nunito",
              position: "absolute",
              left: month.position * 14 + 4,
            }}
          >
            {month.name}
          </Text>
        ))}
      </View>

      {/* Grid del Heatmap */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4"
      >
        <View className="flex-row gap-[3px]">
          {heatmapData.map((week, weekIndex) => (
            <View key={weekIndex} className="flex-col gap-[3px]">
              {week.map((day, dayIndex) => (
                <View
                  key={dayIndex}
                  className="w-[11px] h-[11px] rounded-[3px]"
                  style={{
                    backgroundColor: `rgba(16, 185, 129, ${getOpacity(day.count)})`,
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Leyenda */}
      <View className="flex-row items-center justify-end mt-4 gap-1">
        <Text
          className="text-[10px] text-pastel-text/40 mr-1"
          style={{ fontFamily: "Nunito" }}
        >
          Menos
        </Text>
        {[0.1, 0.3, 0.5, 0.7, 1].map((opacity, i) => (
          <View
            key={i}
            className="w-[10px] h-[10px] rounded-[2px]"
            style={{ backgroundColor: `rgba(16, 185, 129, ${opacity})` }}
          />
        ))}
        <Text
          className="text-[10px] text-pastel-text/40 ml-1"
          style={{ fontFamily: "Nunito" }}
        >
          Más
        </Text>
      </View>
    </View>
  );
}

// ============================================
// COMPONENTE: PIE CHART DE DISTRIBUCIÓN
// ============================================
interface MuscleDistributionChartProps {
  data: MuscleDistribution[];
  isLoading: boolean;
}

function MuscleDistributionChart({ data, isLoading }: MuscleDistributionChartProps) {
  // Asegurar que data sea un array válido
  const safeData = Array.isArray(data) ? data : [];

  const chartSize = 140;
  const radius = 55;
  const innerRadius = 35;
  const center = chartSize / 2;

  const { slices, totalSeries } = useMemo(() => {
    const total = safeData.reduce((acc, d) => acc + d.totalSeries, 0);
    let startAngle = -90;

    const slicesData = safeData.map((item, index) => {
      const percentage = total > 0 ? (item.totalSeries / total) * 100 : 0;
      const angle = (percentage / 100) * 360;
      const endAngle = startAngle + angle;

      // Calcular path del arco
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);

      const ix1 = center + innerRadius * Math.cos(startRad);
      const iy1 = center + innerRadius * Math.sin(startRad);
      const ix2 = center + innerRadius * Math.cos(endRad);
      const iy2 = center + innerRadius * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      const path = `
        M ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
        L ${ix2} ${iy2}
        A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}
        Z
      `;

      const result = {
        path,
        color: CHART_COLORS.distribution[index % CHART_COLORS.distribution.length],
        percentage,
        name: item.muscleGroup,
        series: item.totalSeries,
      };

      startAngle = endAngle;
      return result;
    });

    return { slices: slicesData, totalSeries: total };
  }, [safeData]);

  const translateMuscleGroup = (group: string): string => {
    const translations: Record<string, string> = {
      chest: "Pecho",
      back: "Espalda",
      shoulders: "Hombros",
      legs: "Piernas",
      arms: "Brazos",
      core: "Core",
      biceps: "Bíceps",
      triceps: "Tríceps",
      glutes: "Glúteos",
      pecho: "Pecho",
      espalda: "Espalda",
      hombros: "Hombros",
      piernas: "Piernas",
      brazos: "Brazos",
      abdomen: "Abdomen",
    };
    return translations[group.toLowerCase()] || group;
  };

  if (isLoading) {
    return (
      <View className="bg-white/80 rounded-3xl p-5 mx-6 mb-4">
        <ActivityIndicator color={PASTEL_COLORS.blueDark} />
      </View>
    );
  }

  if (safeData.length === 0) {
    return (
      <View className="bg-white/80 rounded-3xl p-5 mx-6 mb-4">
        <View className="flex-row items-center mb-4">
          <View className="w-10 h-10 rounded-2xl bg-indigo-100 items-center justify-center mr-3">
            <Target size={20} color="#818CF8" />
          </View>
          <Text
            className="text-lg text-pastel-text"
            style={{ fontFamily: "Quicksand-Bold" }}
          >
            Balance Muscular
          </Text>
        </View>
        <Text
          className="text-pastel-text/50 text-center py-8"
          style={{ fontFamily: "Nunito" }}
        >
          No hay datos disponibles aún
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-white/80 rounded-3xl p-5 mx-6 mb-4">
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 rounded-2xl bg-indigo-100 items-center justify-center mr-3">
          <Target size={20} color="#818CF8" />
        </View>
        <View>
          <Text
            className="text-lg text-pastel-text"
            style={{ fontFamily: "Quicksand-Bold" }}
          >
            Balance Muscular
          </Text>
          <Text
            className="text-xs text-pastel-text/50"
            style={{ fontFamily: "Nunito" }}
          >
            Últimos 30 días
          </Text>
        </View>
      </View>

      <View className="flex-row items-center">
        {/* Gráfico de dona */}
        <View className="items-center justify-center">
          <Svg width={chartSize} height={chartSize}>
            <G>
              {slices.map((slice, i) => (
                <Path
                  key={i}
                  d={slice.path}
                  fill={slice.color}
                />
              ))}
            </G>
            {/* Centro */}
            <Circle cx={center} cy={center} r={innerRadius - 5} fill="white" />
          </Svg>
          <View
            className="absolute items-center justify-center"
            style={{ width: chartSize, height: chartSize }}
          >
            <Text
              className="text-2xl text-pastel-text"
              style={{ fontFamily: "Quicksand-Bold" }}
            >
              {totalSeries}
            </Text>
            <Text
              className="text-[10px] text-pastel-text/50"
              style={{ fontFamily: "Nunito" }}
            >
              series
            </Text>
          </View>
        </View>

        {/* Leyenda */}
        <View className="flex-1 ml-4 gap-2">
          {slices.slice(0, 5).map((slice, i) => (
            <View key={i} className="flex-row items-center">
              <View
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: slice.color }}
              />
              <Text
                className="flex-1 text-sm text-pastel-text"
                style={{ fontFamily: "Nunito" }}
                numberOfLines={1}
              >
                {translateMuscleGroup(slice.name)}
              </Text>
              <Text
                className="text-sm text-pastel-text/60"
                style={{ fontFamily: "Nunito-Bold" }}
              >
                {slice.percentage.toFixed(0)}%
              </Text>
            </View>
          ))}
          {slices.length > 5 && (
            <Text
              className="text-xs text-pastel-text/40"
              style={{ fontFamily: "Nunito" }}
            >
              +{slices.length - 5} más
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

// ============================================
// COMPONENTE: SELECTOR DE EJERCICIO
// ============================================
interface ExerciseSelectorProps {
  selectedExercise: { id: string; name: string } | null;
  onSelect: (exercise: { id: string; name: string }) => void;
  exercises: { id: string; name: string }[];
  isOpen: boolean;
  onToggle: () => void;
}

function ExerciseSelector({
  selectedExercise,
  onSelect,
  exercises,
  isOpen,
  onToggle,
}: ExerciseSelectorProps) {
  // Asegurar que exercises sea un array válido
  const safeExercises = Array.isArray(exercises) ? exercises : [];

  return (
    <View className="relative z-10">
      <Pressable
        onPress={onToggle}
        className="flex-row items-center justify-between bg-slate-100 rounded-xl px-4 py-3"
      >
        <Text
          className="text-pastel-text"
          style={{ fontFamily: "Nunito" }}
        >
          {selectedExercise?.name || "Selecciona un ejercicio"}
        </Text>
        <ChevronDown
          size={18}
          color={PASTEL_COLORS.text}
          style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
        />
      </Pressable>

      {isOpen && safeExercises.length > 0 && (
        <View className="absolute top-14 left-0 right-0 bg-white rounded-xl shadow-lg border border-slate-100 max-h-48 overflow-hidden z-20">
          <ScrollView showsVerticalScrollIndicator={false}>
            {safeExercises.map((exercise) => (
              <Pressable
                key={exercise.id}
                onPress={() => {
                  onSelect(exercise);
                  onToggle();
                }}
                className={`px-4 py-3 border-b border-slate-50 ${
                  selectedExercise?.id === exercise.id ? "bg-indigo-50" : ""
                }`}
              >
                <Text
                  className={`${
                    selectedExercise?.id === exercise.id
                      ? "text-indigo-600"
                      : "text-pastel-text"
                  }`}
                  style={{ fontFamily: "Nunito" }}
                >
                  {exercise.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

// ============================================
// COMPONENTE: LINE CHART DE PROGRESIÓN
// ============================================
interface ProgressionChartProps {
  data: ProgressionData[];
  isLoading: boolean;
  selectedExercise: { id: string; name: string } | null;
  onSelectExercise: (exercise: { id: string; name: string }) => void;
  exercises: { id: string; name: string }[];
}

function ProgressionChart({
  data,
  isLoading,
  selectedExercise,
  onSelectExercise,
  exercises,
}: ProgressionChartProps) {
  // Asegurar que data y exercises sean arrays válidos
  const safeData = Array.isArray(data) ? data : [];
  const safeExercises = Array.isArray(exercises) ? exercises : [];

  const [selectorOpen, setSelectorOpen] = useState(false);

  const chartWidth = SCREEN_WIDTH - 80;
  const chartHeight = 160;
  const padding = { top: 20, right: 20, bottom: 30, left: 45 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  const { path, points, maxValue, minValue, best1RM } = useMemo(() => {
    if (safeData.length === 0) {
      return { path: "", points: [], maxValue: 100, minValue: 0, best1RM: 0 };
    }

    const values = safeData.map((d) => d.estimado1RM);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const pts = safeData.map((d, i) => {
      const x = padding.left + (i / (safeData.length - 1 || 1)) * graphWidth;
      const y = padding.top + graphHeight - ((d.estimado1RM - min) / range) * graphHeight;
      return { x, y, value: d.estimado1RM, date: d.fecha };
    });

    // Crear path suave
    let pathD = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpx = (prev.x + curr.x) / 2;
      pathD += ` Q ${prev.x + (curr.x - prev.x) * 0.5} ${prev.y}, ${cpx} ${(prev.y + curr.y) / 2}`;
      pathD += ` Q ${cpx + (curr.x - cpx) * 0.5} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    return { path: pathD, points: pts, maxValue: max, minValue: min, best1RM: max };
  }, [safeData, graphWidth, graphHeight]);

  return (
    <View className="bg-white/80 rounded-3xl p-5 mx-6 mb-4">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-2xl bg-blue-100 items-center justify-center mr-3">
            <TrendingUp size={20} color="#60A5FA" />
          </View>
          <View>
            <Text
              className="text-lg text-pastel-text"
              style={{ fontFamily: "Quicksand-Bold" }}
            >
              Progresión
            </Text>
            <Text
              className="text-xs text-pastel-text/50"
              style={{ fontFamily: "Nunito" }}
            >
              1RM Estimado
            </Text>
          </View>
        </View>
        {best1RM > 0 && (
          <View className="bg-blue-100 px-3 py-1.5 rounded-full">
            <Text
              className="text-blue-700 text-sm"
              style={{ fontFamily: "Nunito-Bold" }}
            >
              Mejor: {best1RM.toFixed(1)} kg
            </Text>
          </View>
        )}
      </View>

      {/* Selector de ejercicio */}
      <View className="mb-4">
        <ExerciseSelector
          selectedExercise={selectedExercise}
          onSelect={onSelectExercise}
          exercises={safeExercises}
          isOpen={selectorOpen}
          onToggle={() => setSelectorOpen(!selectorOpen)}
        />
      </View>

      {/* Gráfica */}
      {isLoading ? (
        <View className="h-40 items-center justify-center">
          <ActivityIndicator color={PASTEL_COLORS.blueDark} />
        </View>
      ) : !selectedExercise ? (
        <View className="h-40 items-center justify-center">
          <Text
            className="text-pastel-text/50"
            style={{ fontFamily: "Nunito" }}
          >
            Selecciona un ejercicio para ver tu progresión
          </Text>
        </View>
      ) : safeData.length === 0 ? (
        <View className="h-40 items-center justify-center">
          <Text
            className="text-pastel-text/50"
            style={{ fontFamily: "Nunito" }}
          >
            No hay datos de progresión disponibles
          </Text>
        </View>
      ) : (
        <Svg width={chartWidth} height={chartHeight}>
          <Defs>
            <LinearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#60A5FA" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Grid horizontal */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding.top + graphHeight * (1 - ratio);
            const value = minValue + (maxValue - minValue) * ratio;
            return (
              <G key={i}>
                <Line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
                <Rect
                  x={0}
                  y={y - 8}
                  width={40}
                  height={16}
                  fill="white"
                />
              </G>
            );
          })}

          {/* Área bajo la curva */}
          {points.length > 0 && (
            <Path
              d={`${path} L ${points[points.length - 1].x} ${padding.top + graphHeight} L ${points[0].x} ${padding.top + graphHeight} Z`}
              fill="url(#lineGradient)"
            />
          )}

          {/* Línea de la gráfica */}
          <Path
            d={path}
            fill="none"
            stroke="#60A5FA"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Puntos */}
          {points.map((point, i) => (
            <Circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={4}
              fill="white"
              stroke="#60A5FA"
              strokeWidth={2}
            />
          ))}
        </Svg>
      )}

      {/* Etiquetas Y */}
      {safeData.length > 0 && (
        <View className="absolute left-5 top-20" style={{ height: graphHeight }}>
          {[0, 0.5, 1].map((ratio, i) => {
            const value = minValue + (maxValue - minValue) * ratio;
            return (
              <Text
                key={i}
                className="text-[10px] text-pastel-text/50 absolute"
                style={{
                  fontFamily: "Nunito",
                  top: graphHeight * (1 - ratio) - 6,
                }}
              >
                {value.toFixed(0)}
              </Text>
            );
          })}
        </View>
      )}
    </View>
  );
}

// ============================================
// COMPONENTE: TARJETA DE RÉCORD
// ============================================
interface RecordCardProps {
  name: string;
  weight: number;
  date: string;
  index: number;
}

function RecordCard({ name, weight, date, index }: RecordCardProps) {
  const colors = [
    { bg: "bg-amber-100", icon: "#F59E0B" },
    { bg: "bg-slate-100", icon: "#64748B" },
    { bg: "bg-orange-100", icon: "#EA580C" },
    { bg: "bg-indigo-100", icon: "#818CF8" },
  ];

  const color = colors[index % colors.length];
  const Icon = index === 0 ? Trophy : index === 1 ? Award : Dumbbell;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  return (
    <View
      className="bg-white rounded-2xl p-4 mr-3 shadow-sm"
      style={{ width: 160, minHeight: 140 }}
    >
      <View className={`w-12 h-12 rounded-2xl ${color.bg} items-center justify-center mb-3`}>
        <Icon size={24} color={color.icon} />
      </View>
      <Text
        className="text-pastel-text text-sm mb-1"
        style={{ fontFamily: "Nunito-Bold" }}
        numberOfLines={2}
      >
        {name}
      </Text>
      <Text
        className="text-2xl text-pastel-text"
        style={{ fontFamily: "Quicksand-Bold" }}
      >
        {weight} kg
      </Text>
      <Text
        className="text-xs text-pastel-text/50 mt-1"
        style={{ fontFamily: "Nunito" }}
      >
        {formatDate(date)}
      </Text>
    </View>
  );
}

// ============================================
// COMPONENTE: SECCIÓN DE RÉCORDS
// ============================================
interface RecordsSectionProps {
  records: Array<{ exerciseName: string; weight: number; date: string }>;
  isLoading: boolean;
}

function RecordsSection({ records, isLoading }: RecordsSectionProps) {
  // Asegurar que records sea un array válido
  const safeRecords = Array.isArray(records) ? records : [];

  if (isLoading) {
    return (
      <View className="px-6 mb-4">
        <View className="bg-white/80 rounded-3xl p-5">
          <ActivityIndicator color={PASTEL_COLORS.blueDark} />
        </View>
      </View>
    );
  }

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between px-6 mb-4">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-2xl bg-amber-100 items-center justify-center mr-3">
            <Trophy size={20} color="#F59E0B" />
          </View>
          <View>
            <Text
              className="text-lg text-pastel-text"
              style={{ fontFamily: "Quicksand-Bold" }}
            >
              Récords Personales
            </Text>
            <Text
              className="text-xs text-pastel-text/50"
              style={{ fontFamily: "Nunito" }}
            >
              Tus mejores marcas
            </Text>
          </View>
        </View>
      </View>

      {safeRecords.length === 0 ? (
        <View className="bg-white/80 rounded-3xl p-5 mx-6">
          <Text
            className="text-pastel-text/50 text-center"
            style={{ fontFamily: "Nunito" }}
          >
            Aún no tienes récords registrados
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          {safeRecords.map((record, index) => (
            <RecordCard
              key={`${record.exerciseName}-${index}`}
              name={record.exerciseName}
              weight={record.weight}
              date={record.date}
              index={index}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// ============================================
// PANTALLA PRINCIPAL: REPORTS
// ============================================
export default function ReportsScreen() {
  const {
    consistency,
    muscleDistribution,
    progression,
    records,
    isLoading,
    isLoadingProgression,
    fetchProgression,
  } = useStats();

  const { exercises, fetchExercises } = useExercises();

  const [selectedExercise, setSelectedExercise] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Cargar ejercicios al montar
  useEffect(() => {
    fetchExercises({ limit: 50 });
  }, []);

  const exerciseOptions = useMemo(
    () =>
      (Array.isArray(exercises) ? exercises : []).map((e) => ({
        id: e._id || e.id || "",
        name: e.nombre,
      })),
    [exercises]
  );

  const handleSelectExercise = (exercise: { id: string; name: string }) => {
    setSelectedExercise(exercise);
    if (exercise.id) {
      fetchProgression(exercise.id);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <ReportsHeader />

          <ConsistencyHeatmap data={consistency} isLoading={isLoading} />

          <MuscleDistributionChart
            data={muscleDistribution}
            isLoading={isLoading}
          />

          <ProgressionChart
            data={progression}
            isLoading={isLoadingProgression}
            selectedExercise={selectedExercise}
            onSelectExercise={handleSelectExercise}
            exercises={exerciseOptions}
          />

          <RecordsSection records={records} isLoading={isLoading} />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

