import { View, Text, Pressable } from "react-native";
import { ActivityItem } from "./ActivityItem";
import type { RecentActivityListProps } from "@/types";

interface ExtendedRecentActivityListProps extends RecentActivityListProps {
  onEditActivity?: (id: string) => void;
  onDeleteActivity?: (id: string) => void;
}

/**
 * Lista de actividades recientes con título y botón "Ver todo".
 * Diseño dark premium.
 */
export function RecentActivityList({
  activities,
  onViewAll,
  onEditActivity,
  onDeleteActivity,
}: ExtendedRecentActivityListProps) {
  return (
    <View className="px-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text
          className="text-xl text-dark-text"
          style={{ fontFamily: "Quicksand-Bold" }}
        >
          Actividad Reciente
        </Text>
        <Pressable
          onPress={onViewAll}
          className="bg-accent-cyan/20 px-3 py-1 rounded-full"
        >
          <Text
            className="text-accent-cyan text-sm"
            style={{ fontFamily: "Nunito-Bold" }}
          >
            Ver todo
          </Text>
        </Pressable>
      </View>

      <View className="gap-4">
        {activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            title={activity.title}
            subtitle={activity.subtitle}
            iconName={activity.iconName}
            value={activity.value}
            timestamp={activity.timestamp}
            accentColor={activity.accentColor}
            onEdit={onEditActivity ? () => onEditActivity(activity.id) : undefined}
            onDelete={onDeleteActivity ? () => onDeleteActivity(activity.id) : undefined}
          />
        ))}
      </View>
    </View>
  );
}
