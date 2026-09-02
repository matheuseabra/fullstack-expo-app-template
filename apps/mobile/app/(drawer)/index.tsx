import { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Container } from "@/components/container";
import { DAYMARK_COLORS, DAYMARK_RADII, DAYMARK_SPACING, DAYMARK_TYPE } from "@/constants/daymark";

type Task = { id: string; title: string; completed: boolean };

const INITIAL_TASKS: Task[] = [
  { id: "draft", title: "Write the first draft", completed: true },
  { id: "break", title: "Take a proper break", completed: false },
  { id: "note", title: "Send the project note", completed: false },
];

function BrandRow() {
  return (
    <View style={styles.brandRow}>
      <View style={styles.brandLockup}>
        <View style={styles.brandMark} accessibilityElementsHidden>
          <View style={styles.brandMarkBar} />
          <View style={[styles.brandMarkBar, styles.brandMarkBarShort]} />
        </View>
        <Text style={styles.brandName}>daymark</Text>
      </View>
      <Ionicons name="menu-outline" size={25} color={DAYMARK_COLORS.text} accessibilityLabel="Open menu" />
    </View>
  );
}

function ProgressCard({ completed, total }: { completed: number; total: number }) {
  const progress = total === 0 ? 0 : completed / total;

  return (
    <View style={styles.progressCard}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>Today</Text>
        <Text style={styles.progressMeta}>{completed} of {total} done</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: () => void }) {
  return (
    <Pressable style={styles.taskRow} onPress={onToggle} accessibilityRole="checkbox" accessibilityState={{ checked: task.completed }}>
      <View style={[styles.taskCheck, task.completed && styles.taskCheckDone]}>
        {task.completed ? <Ionicons name="checkmark" size={15} color={DAYMARK_COLORS.white} /> : null}
      </View>
      <Text style={[styles.taskText, task.completed && styles.taskTextDone]}>{task.title}</Text>
    </Pressable>
  );
}

function BottomNav() {
  const router = useRouter();
  const items = useMemo(() => [
    { label: "Today", icon: "checkbox-outline" as const },
    { label: "Week", icon: "calendar-outline" as const, onPress: () => router.push("/(drawer)/(tabs)") },
    { label: "Tasks", icon: "list-outline" as const, onPress: () => router.push("/(drawer)/todos") },
    { label: "Settings", icon: "settings-outline" as const, onPress: () => router.push("/(drawer)/(tabs)/two") },
  ], [router]);

  return (
    <View style={styles.bottomNav}>
      {items.map((item, index) => (
        <Pressable key={item.label} style={styles.navItem} onPress={item.onPress} accessibilityRole="button">
          <Ionicons name={item.icon} size={21} color={index === 0 ? DAYMARK_COLORS.black : DAYMARK_COLORS.textMuted} />
          <Text style={[styles.navLabel, index === 0 && styles.navLabelActive]}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const completedCount = tasks.filter((task) => task.completed).length;

  const toggleTask = (id: string) => {
    setTasks((currentTasks) => currentTasks.map((task) => (
      task.id === id ? { ...task, completed: !task.completed } : task
    )));
  };

  const addTask = () => {
    setTasks((currentTasks) => [
      ...currentTasks,
      { id: `task-${currentTasks.length}`, title: "Plan tomorrow's first step", completed: false },
    ]);
  };

  return (
    <Container isScrollable={false} style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + DAYMARK_SPACING.lg }]} showsVerticalScrollIndicator={false}>
        <BrandRow />
        <View style={styles.headingBlock}>
          <Text style={styles.pageTitle}>Today</Text>
          <Text style={styles.dateLine}>Tuesday, 15 October</Text>
          <Text style={styles.greeting}>Good morning, Matheus.</Text>
        </View>
        <ProgressCard completed={completedCount} total={tasks.length} />
        <View style={styles.taskList}>
          {tasks.map((task) => <TaskRow key={task.id} task={task} onToggle={() => toggleTask(task.id)} />)}
        </View>
        <Pressable style={styles.addButton} onPress={addTask} accessibilityRole="button">
          <Ionicons name="add" size={23} color={DAYMARK_COLORS.white} />
          <Text style={styles.addButtonText}>Add a task</Text>
        </Pressable>
      </ScrollView>
      <BottomNav />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: DAYMARK_COLORS.canvas },
  content: { paddingHorizontal: DAYMARK_SPACING.xl, paddingBottom: DAYMARK_SPACING.xl },
  brandRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 44 },
  brandLockup: { flexDirection: "row", alignItems: "center", gap: DAYMARK_SPACING.sm },
  brandMark: { width: 18, height: 18, flexDirection: "row", alignItems: "flex-end", gap: 3 },
  brandMarkBar: { width: 7, height: 18, backgroundColor: DAYMARK_COLORS.black },
  brandMarkBarShort: { height: 12 },
  brandName: { color: DAYMARK_COLORS.text, fontSize: 17, fontWeight: "600", letterSpacing: -0.4 },
  headingBlock: { marginTop: 48, marginBottom: DAYMARK_SPACING.xl },
  pageTitle: { ...DAYMARK_TYPE.pageTitle, color: DAYMARK_COLORS.text, letterSpacing: -0.6 },
  dateLine: { ...DAYMARK_TYPE.small, color: DAYMARK_COLORS.textMuted, marginTop: DAYMARK_SPACING.sm },
  greeting: { ...DAYMARK_TYPE.body, color: DAYMARK_COLORS.text, marginTop: DAYMARK_SPACING.md },
  progressCard: { backgroundColor: DAYMARK_COLORS.surface, borderColor: DAYMARK_COLORS.border, borderRadius: DAYMARK_RADII.surface, borderWidth: 1, padding: DAYMARK_SPACING.lg, marginBottom: DAYMARK_SPACING.lg },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: DAYMARK_SPACING.md },
  progressLabel: { ...DAYMARK_TYPE.label, color: DAYMARK_COLORS.text },
  progressMeta: { ...DAYMARK_TYPE.small, color: DAYMARK_COLORS.textMuted },
  progressTrack: { backgroundColor: DAYMARK_COLORS.surfaceMuted, borderRadius: DAYMARK_RADII.round, height: 6, overflow: "hidden" },
  progressFill: { backgroundColor: DAYMARK_COLORS.black, borderRadius: DAYMARK_RADII.round, height: "100%" },
  taskList: { backgroundColor: DAYMARK_COLORS.surface, borderTopColor: DAYMARK_COLORS.border, borderTopWidth: 1 },
  taskRow: { alignItems: "center", borderBottomColor: DAYMARK_COLORS.border, borderBottomWidth: 1, flexDirection: "row", gap: DAYMARK_SPACING.md, minHeight: 56, paddingVertical: DAYMARK_SPACING.sm },
  taskCheck: { alignItems: "center", borderColor: DAYMARK_COLORS.borderStrong, borderRadius: DAYMARK_RADII.round, borderWidth: 1.5, height: 24, justifyContent: "center", width: 24 },
  taskCheckDone: { backgroundColor: DAYMARK_COLORS.black, borderColor: DAYMARK_COLORS.black },
  taskText: { ...DAYMARK_TYPE.body, color: DAYMARK_COLORS.text, flex: 1 },
  taskTextDone: { color: DAYMARK_COLORS.textMuted, textDecorationLine: "line-through" },
  addButton: { alignItems: "center", backgroundColor: DAYMARK_COLORS.black, borderRadius: DAYMARK_RADII.control, flexDirection: "row", gap: DAYMARK_SPACING.sm, justifyContent: "center", minHeight: 52, marginTop: DAYMARK_SPACING.xl },
  addButtonText: { ...DAYMARK_TYPE.label, color: DAYMARK_COLORS.white },
  bottomNav: { backgroundColor: DAYMARK_COLORS.surface, borderTopColor: DAYMARK_COLORS.border, borderTopWidth: 1, flexDirection: "row", justifyContent: "space-around", paddingBottom: 8, paddingTop: 10 },
  navItem: { alignItems: "center", gap: 3, minHeight: 44, minWidth: 64 },
  navLabel: { ...DAYMARK_TYPE.small, color: DAYMARK_COLORS.textMuted, fontSize: 11 },
  navLabelActive: { color: DAYMARK_COLORS.black, fontWeight: "600" },
});
