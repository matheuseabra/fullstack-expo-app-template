import { ArrowLeftIcon, CalendarBlankIcon, CircleIcon, GearIcon, HouseIcon, MagnifyingGlassIcon, PlusIcon, type Icon } from "phosphor-react-native";
import { Tabs, useRouter } from "expo-router";
import { type ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DAYMARK_RADII, DAYMARK_SPACING } from "@/constants/daymark";
import { useDaymarkColors } from "@/hooks/use-daymark-theme";
import { useAddTaskSheetStore } from "@/stores/add-task-sheet-store";
import { hapticLight, hapticMedium, hapticSelection } from "@/utils/haptics";

type TabBarProps = NonNullable<ComponentProps<typeof Tabs>["tabBar"]> extends (props: infer Props) => unknown ? Props : never;
type TabRoute = TabBarProps["state"]["routes"][number];

const tabIcons: Record<string, Icon> = {
  index: HouseIcon,
  week: CalendarBlankIcon,
  search: MagnifyingGlassIcon,
  settings: GearIcon,
};

const tabLabels: Record<string, string> = {
  index: "Today",
  week: "Week",
  search: "Search",
  settings: "Settings",
};

export function ScreenHeader({ title }: { title: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useDaymarkColors();
  const styles = makeStyles(colors);

  return (
    <View style={[styles.header, { paddingTop: insets.top + DAYMARK_SPACING.sm }]}>
      <Pressable onPress={() => { hapticLight(); router.replace("/(tabs)"); }} style={styles.floatingButton} accessibilityRole="button" accessibilityLabel={`Go back from ${title} to Today`}>
        <ArrowLeftIcon size={22} weight="bold" color={colors.text} />
      </Pressable>
    </View>
  );
}

function TabButton({ route, index, props }: { route: TabRoute; index: number; props: TabBarProps }) {
  const isFocused = props.state.index === index;
  const label = tabLabels[route.name] ?? route.name;
  const colors = useDaymarkColors();
  const styles = makeStyles(colors);
  const TabIcon = tabIcons[route.name] ?? CircleIcon;

  const handlePress = () => {
    const event = props.navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
    if (!isFocused && !event.defaultPrevented) {
      hapticSelection();
      props.navigation.navigate(route.name);
    }
  };

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: isFocused }}
      onPress={handlePress}
      style={styles.navItem}
    >
      <TabIcon size={22} weight={isFocused ? "fill" : "bold"} color={isFocused ? colors.black : colors.textMuted} />
    </Pressable>
  );
}

export function DaymarkTabBar(props: TabBarProps) {
  const insets = useSafeAreaInsets();
  const colors = useDaymarkColors();
  const styles = makeStyles(colors);
  const activeRouteName = props.state.routes[props.state.index]?.name;
  const showFab = activeRouteName === "index" || activeRouteName === "search";
  const openAddTaskSheet = useAddTaskSheetStore((state) => state.open);

  return (
    <View style={[styles.bottomNav, { paddingBottom: insets.bottom + DAYMARK_SPACING.md }]}>
      <View style={styles.tabBarPill}>
        {props.state.routes.map((route, index) => <TabButton key={route.key} route={route} index={index} props={props} />)}
      </View>
      {showFab ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add task"
          onPress={() => { hapticMedium(); openAddTaskSheet(); }}
          style={styles.fab}
        >
          <PlusIcon size={28} weight="bold" color={colors.white} />
        </Pressable>
      ) : null}
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useDaymarkColors>) {
  return StyleSheet.create({
  header: { alignItems: "center", backgroundColor: colors.canvas, flexDirection: "row", justifyContent: "space-between", paddingBottom: DAYMARK_SPACING.sm, paddingHorizontal: DAYMARK_SPACING.screen },
  floatingButton: { alignItems: "center", backgroundColor: colors.surface, borderRadius: DAYMARK_RADII.round, elevation: 1, height: 44, justifyContent: "center", shadowColor: colors.black, shadowOffset: { height: 2, width: 0 }, shadowOpacity: 0.05, shadowRadius: 8, width: 44 },
  bottomNav: { backgroundColor: colors.canvas, paddingHorizontal: DAYMARK_SPACING.md, paddingTop: DAYMARK_SPACING.sm, position: "relative" },
  tabBarPill: { alignItems: "center", alignSelf: "stretch", backgroundColor: "transparent", flexDirection: "row", height: 52, width: "100%" },
  navItem: { alignItems: "center", flex: 1, height: 48, justifyContent: "center", minWidth: 48 },
  fab: { alignItems: "center", backgroundColor: colors.black, borderRadius: DAYMARK_RADII.round, elevation: 3, height: 52, justifyContent: "center", position: "absolute", right: DAYMARK_SPACING.md, shadowColor: colors.black, shadowOffset: { height: 3, width: 0 }, shadowOpacity: 0.1, shadowRadius: 6, top: -54, width: 52 },
  });
}
