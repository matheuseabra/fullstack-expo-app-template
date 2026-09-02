import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { StyleSheet } from "react-native";
import { DAYMARK_COLORS, DAYMARK_TYPE } from "@/constants/daymark";

function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: DAYMARK_COLORS.text,
        drawerInactiveTintColor: DAYMARK_COLORS.textMuted,
        drawerLabelStyle: styles.drawerLabel,
        drawerStyle: styles.drawer,
        drawerContentStyle: styles.drawerContent,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Today",
          drawerIcon: ({ size, color }) => <Ionicons name="checkbox-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="week"
        options={{
          drawerLabel: "Week",
          drawerIcon: ({ size, color }) => <Ionicons name="calendar-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="todos"
        options={{
          drawerLabel: "Tasks",
          drawerIcon: ({ size, color }) => <Ionicons name="list-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: "Settings",
          drawerIcon: ({ size, color }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawer: { backgroundColor: DAYMARK_COLORS.surface, width: 280 },
  drawerContent: { paddingTop: 48 },
  drawerLabel: { ...DAYMARK_TYPE.label, color: DAYMARK_COLORS.text },
});

export default DrawerLayout;
