import { Tabs } from "expo-router";
import { DaymarkTabBar } from "@/components/daymark-navigation";

function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <DaymarkTabBar {...props} />}
      screenOptions={{
        animation: "fade",
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
        name="todos"
        options={{
          title: "Tasks",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  );
}

export default TabsLayout;
