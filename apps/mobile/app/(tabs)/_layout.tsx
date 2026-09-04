import { Tabs } from "expo-router";
import { AddTaskSheet } from "@/components/add-task-sheet";
import { DaymarkTabBar } from "@/components/daymark-navigation";

function TabsLayout() {
  return (
    <>
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
    </>
  );
}

export default TabsLayout;
