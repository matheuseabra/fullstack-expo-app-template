import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DAYMARK_COLORS, DAYMARK_SPACING, DAYMARK_TYPE } from "@/constants/daymark";

type NavigationKey = "today" | "week" | "tasks" | "settings";
type DrawerNavigation = { openDrawer?: () => void; getParent?: () => DrawerNavigation | undefined };

const navigationItems: Array<{ key: NavigationKey; label: string; icon: keyof typeof Ionicons.glyphMap; path: Href }> = [
  { key: "today", label: "Today", icon: "checkbox-outline", path: "/(drawer)" },
  { key: "week", label: "Week", icon: "calendar-outline", path: "/(drawer)/week" },
  { key: "tasks", label: "Tasks", icon: "list-outline", path: "/(drawer)/todos" },
  { key: "settings", label: "Settings", icon: "settings-outline", path: "/(drawer)/settings" },
];

export function MenuButton() {
  const navigation = useNavigation();

  return (
    <Pressable onPress={() => findDrawer(navigation as unknown as DrawerNavigation)?.openDrawer?.()} style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Open menu">
      <Ionicons name="menu-outline" size={25} color={DAYMARK_COLORS.text} />
    </Pressable>
  );
}

function findDrawer(navigation: DrawerNavigation) {
  let current: DrawerNavigation | undefined = navigation;
  for (let depth = 0; depth < 3 && current; depth += 1) {
    if (current.openDrawer) return current;
    current = current.getParent?.();
  }
  return undefined;
}

export function ScreenHeader({ title }: { title: string }) {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + DAYMARK_SPACING.sm }]}>
      <Pressable onPress={() => router.replace("/(drawer)")} style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Go back to Today">
        <Ionicons name="arrow-back" size={22} color={DAYMARK_COLORS.text} />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      <MenuButton />
    </View>
  );
}

export function AppBottomNav({ active }: { active: NavigationKey }) {
  const router = useRouter();
  const handleNavigation = (item: (typeof navigationItems)[number]) => {
    if (item.key === active) return;
    router.replace(item.path);
  };

  return (
    <View style={styles.bottomNav}>
      {navigationItems.map((item) => {
        const isActive = item.key === active;
        return (
          <Pressable key={item.key} style={styles.navItem} onPress={() => handleNavigation(item)} accessibilityRole="button" accessibilityState={{ selected: isActive }}>
            <Ionicons name={item.icon} size={21} color={isActive ? DAYMARK_COLORS.black : DAYMARK_COLORS.textMuted} />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", backgroundColor: DAYMARK_COLORS.canvas, flexDirection: "row", justifyContent: "space-between", paddingBottom: DAYMARK_SPACING.md, paddingHorizontal: DAYMARK_SPACING.lg },
  headerTitle: { ...DAYMARK_TYPE.sectionTitle, color: DAYMARK_COLORS.text },
  iconButton: { alignItems: "center", height: 40, justifyContent: "center", width: 40 },
  bottomNav: { backgroundColor: DAYMARK_COLORS.surface, borderTopColor: DAYMARK_COLORS.border, borderTopWidth: 1, flexDirection: "row", justifyContent: "space-around", paddingBottom: 8, paddingTop: 10 },
  navItem: { alignItems: "center", gap: 3, minHeight: 44, minWidth: 64 },
  navLabel: { ...DAYMARK_TYPE.small, color: DAYMARK_COLORS.textMuted, fontSize: 11 },
  navLabelActive: { color: DAYMARK_COLORS.black, fontWeight: "600" },
});
