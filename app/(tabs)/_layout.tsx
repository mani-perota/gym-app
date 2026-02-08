import { Tabs, useRouter } from "expo-router";
import { BottomTabBar } from "@/components/navigation";
import { FabMic } from "@/components/ui";

/**
 * Layout de navegación por tabs con barra personalizada y FAB.
 */
export default function TabLayout() {
  const router = useRouter();

  const handleMicPress = () => {
    router.push("/voice-input");
  };

  return (
    <>
      <Tabs
        tabBar={(props) => <BottomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="reports" />
        <Tabs.Screen name="diary" />
        <Tabs.Screen name="settings" />
      </Tabs>
      <FabMic onPress={handleMicPress} />
    </>
  );
}
