import { Tabs, usePathname, useRouter } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-worklets";
import { View } from "react-native";
import { AddTaskSheet } from "@/components/add-task-sheet";
import { DaymarkTabBar } from "@/components/daymark-navigation";
import { hapticSelection } from "@/utils/haptics";

const tabPaths = ["/(tabs)", "/(tabs)/week", "/(tabs)/search", "/(tabs)/settings"] as const;

function tabIndexForPath(pathname: string) {
  if (pathname.endsWith("/week")) return 1;
  if (pathname.endsWith("/search")) return 2;
  if (pathname.endsWith("/settings")) return 3;
  return 0;
}

function TabsLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const navigateBySwipe = (direction: -1 | 1) => {
    const nextIndex = tabIndexForPath(pathname) + direction;
    const nextPath = tabPaths[nextIndex];
    if (!nextPath) return;
    hapticSelection();
    router.navigate(nextPath);
  };
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-28, 28])
    .failOffsetY([-20, 20])
    .onEnd((event) => {
      if (Math.abs(event.translationX) < 56 && Math.abs(event.velocityX) < 600) return;
      runOnJS(navigateBySwipe)(event.translationX < 0 ? 1 : -1);
    });

  return (
    <GestureDetector gesture={swipeGesture}>
      <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => <DaymarkTabBar {...props} />}
        screenOptions={{
          animation: "shift",
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Today",
          }}
        />
        <Tabs.Screen
          name="week"
          options={{
            title: "Week",
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
          }}
        />
      </Tabs>
      <AddTaskSheet />
      </View>
    </GestureDetector>
  );
}

export default TabsLayout;
