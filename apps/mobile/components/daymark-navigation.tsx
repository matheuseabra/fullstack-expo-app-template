import { ArrowLeftIcon, CalendarBlankIcon, CheckSquareIcon, CircleIcon, DotsThreeIcon, GearIcon, ListIcon, PlusIcon, type Icon } from "phosphor-react-native";
import { Tabs, useRouter } from "expo-router";
import { type ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DAYMARK_RADII, DAYMARK_SPACING } from "@/constants/daymark";
import { useDaymarkColors } from "@/hooks/use-daymark-theme";
import { hapticLight, hapticMedium, hapticSelection } from "@/utils/haptics";

type TabBarProps = NonNullable<ComponentProps<typeof Tabs>["tabBar"]> extends (props: infer Props) => unknown ? Props : never;
type TabRoute = TabBarProps["state"]["routes"][number];

const tabIcons: Record<string, Icon> = {
  index: CheckSquareIcon,
  week: CalendarBlankIcon,
  todos: ListIcon,
  settings: GearIcon,
};

const tabLabels: Record<string, string> = {
  index: "Today",
  week: "Week",
  todos: "Tasks",
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
      <View accessible accessibilityLabel={title} style={styles.headerTitleSpacer} />
      <OverflowButton />
    </View>
  );
}

export function OverflowButton() {
  const colors = useDaymarkColors();
  const styles = makeStyles(colors);

  return (
    <Pressable style={styles.floatingButton} accessibilityRole="button" accessibilityLabel="More options">
      <DotsThreeIcon size={22} weight="bold" color={colors.text} />
    </Pressable>
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
  const leftTabs = props.state.routes.slice(0, 2);
  const rightTabs = props.state.routes.slice(2);
  const activeRouteName = props.state.routes[props.state.index]?.name;
  const showFab = activeRouteName === "index" || activeRouteName === "todos";

  return (
    <View style={[styles.bottomNav, { paddingBottom: insets.bottom + DAYMARK_SPACING.md }]}>
      <View style={styles.tabBarPill}>
        <View style={styles.tabGroup}>
          {leftTabs.map((route, index) => <TabButton key={route.key} route={route} index={index} props={props} />)}
        </View>
        <View style={styles.tabGroup}>
          {rightTabs.map((route, index) => <TabButton key={route.key} route={route} index={index + 2} props={props} />)}
        </View>
      </View>
      {showFab ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add task"
          onPress={() => { hapticMedium(); props.navigation.navigate("todos", { focus: "1" }); }}
          style={styles.fab}
        >
          <PlusIcon size={26} weight="bold" color={colors.white} />
        </Pressable>
      ) : null}
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useDaymarkColors>) {
  return StyleSheet.create({
  header: { alignItems: "center", backgroundColor: colors.canvas, flexDirection: "row", justifyContent: "space-between", paddingBottom: DAYMARK_SPACING.sm, paddingHorizontal: DAYMARK_SPACING.xl },
  headerTitleSpacer: { flex: 1 },
  floatingButton: { alignItems: "center", backgroundColor: colors.surface, borderRadius: DAYMARK_RADII.round, elevation: 2, height: 44, justifyContent: "center", shadowColor: colors.black, shadowOffset: { height: 4, width: 0 }, shadowOpacity: 0.07, shadowRadius: 12, width: 44 },
  bottomNav: { backgroundColor: colors.canvas, paddingHorizontal: DAYMARK_SPACING.xl, paddingTop: 4, position: "relative" },
  tabBarPill: { alignItems: "center", backgroundColor: "transparent", flexDirection: "row", height: 52, paddingHorizontal: 0 },
  tabGroup: { alignItems: "center", flex: 1, flexDirection: "row", justifyContent: "space-around" },
  navItem: { alignItems: "center", height: 48, justifyContent: "center", width: 48 },
  fab: { alignItems: "center", backgroundColor: colors.black, borderRadius: DAYMARK_RADII.round, elevation: 4, height: 48, justifyContent: "center", position: "absolute", right: 32, shadowColor: colors.black, shadowOffset: { height: 4, width: 0 }, shadowOpacity: 0.14, shadowRadius: 8, top: -50, width: 48 },
  });
}
