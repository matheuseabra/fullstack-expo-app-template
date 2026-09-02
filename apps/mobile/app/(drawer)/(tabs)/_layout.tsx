import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DAYMARK_COLORS, DAYMARK_TYPE } from "@/constants/daymark";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: true,
				headerStyle: { backgroundColor: DAYMARK_COLORS.surface },
				headerTintColor: DAYMARK_COLORS.text,
				headerTitleStyle: { ...DAYMARK_TYPE.sectionTitle, color: DAYMARK_COLORS.text },
				tabBarStyle: {
					backgroundColor: DAYMARK_COLORS.surface,
					borderTopColor: DAYMARK_COLORS.border,
					height: 76,
					paddingTop: 8,
				},
				tabBarActiveTintColor: DAYMARK_COLORS.black,
				tabBarInactiveTintColor: DAYMARK_COLORS.textMuted,
				tabBarLabelStyle: { ...DAYMARK_TYPE.small, fontSize: 11 },
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Week",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="calendar-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="two"
				options={{
					title: "Settings",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="settings-outline" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
