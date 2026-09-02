import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Container } from "@/components/container";
import { DAYMARK_COLORS, DAYMARK_RADII, DAYMARK_SPACING, DAYMARK_TYPE } from "@/constants/daymark";
import { AppBottomNav, MenuButton } from "@/components/daymark-navigation";
import { useTodos } from "@/hooks/use-todos";

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
      <MenuButton />
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

function TaskRow({ task, onToggle, disabled }: { task: { text: string; completed: boolean }; onToggle: () => void; disabled: boolean }) {
  return (
    <Pressable disabled={disabled} style={styles.taskRow} onPress={onToggle} accessibilityRole="checkbox" accessibilityState={{ checked: task.completed }}>
      <View style={[styles.taskCheck, task.completed && styles.taskCheckDone]}>
        {task.completed ? <Ionicons name="checkmark" size={15} color={DAYMARK_COLORS.white} /> : null}
      </View>
      <Text style={[styles.taskText, task.completed && styles.taskTextDone]}>{task.text}</Text>
    </Pressable>
  );
}

function formatToday(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const { taskList, isLoading, isError, refetch, isPending, isMutationError, createTodo, toggleTodo } = useTodos();
  const completedCount = taskList.filter((task) => task.completed).length;
  const today = new Date();

  const handleAddTask = () => {
    const text = newTaskText.trim();
    if (!text || isPending) return;
    void createTodo(text).then(() => {
        setNewTaskText("");
        setIsAdding(false);
      }).catch(() => undefined);
  };

  return (
    <Container isScrollable={false} style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + DAYMARK_SPACING.lg }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <BrandRow />
        <View style={styles.headingBlock}>
          <Text style={styles.pageTitle}>Today</Text>
          <Text style={styles.dateLine}>{formatToday(today)}</Text>
          <Text style={styles.greeting}>Good morning.</Text>
        </View>
        <ProgressCard completed={completedCount} total={taskList.length} />
        {isLoading ? (
          <View style={styles.statusState}><Text style={styles.statusText}>Loading your tasks…</Text></View>
        ) : isError ? (
          <View style={styles.statusState}>
            <Text style={styles.statusText}>We couldn’t load your tasks.</Text>
            <Pressable onPress={() => refetch()} accessibilityRole="button"><Text style={styles.retryText}>Try again</Text></Pressable>
          </View>
        ) : taskList.length === 0 ? (
          <View style={styles.statusState}><Text style={styles.statusText}>Your day is clear.</Text></View>
        ) : (
          <View style={styles.taskList}>
            {taskList.map((task) => <TaskRow key={task.id} task={task} disabled={isPending} onToggle={() => { void toggleTodo(task.id, !task.completed).catch(() => undefined); }} />)}
          </View>
        )}
        {isAdding ? (
          <View style={styles.addRow}>
            <TextInput autoFocus value={newTaskText} onChangeText={setNewTaskText} onSubmitEditing={handleAddTask} placeholder="What needs your attention?" placeholderTextColor={DAYMARK_COLORS.textSubtle} editable={!isPending} returnKeyType="done" style={styles.input} />
            <Pressable disabled={!newTaskText.trim() || isPending} onPress={handleAddTask} style={[styles.addIconButton, (!newTaskText.trim() || isPending) && styles.addIconButtonDisabled]} accessibilityRole="button" accessibilityLabel="Save task">
              <Ionicons name="arrow-up" size={20} color={newTaskText.trim() ? DAYMARK_COLORS.white : DAYMARK_COLORS.textSubtle} />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.addButton} onPress={() => setIsAdding(true)} accessibilityRole="button">
            <Ionicons name="add" size={23} color={DAYMARK_COLORS.white} />
            <Text style={styles.addButtonText}>Add a task</Text>
          </Pressable>
        )}
        {isMutationError ? <Text style={styles.errorText}>Couldn’t save that task. Try again.</Text> : null}
      </ScrollView>
      <AppBottomNav active="today" />
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
  statusState: { alignItems: "center", backgroundColor: DAYMARK_COLORS.surface, borderColor: DAYMARK_COLORS.border, borderRadius: DAYMARK_RADII.surface, borderWidth: 1, padding: DAYMARK_SPACING.xl },
  statusText: { ...DAYMARK_TYPE.body, color: DAYMARK_COLORS.textMuted },
  retryText: { ...DAYMARK_TYPE.label, color: DAYMARK_COLORS.text, marginTop: DAYMARK_SPACING.md },
  addButton: { alignItems: "center", backgroundColor: DAYMARK_COLORS.black, borderRadius: DAYMARK_RADII.control, flexDirection: "row", gap: DAYMARK_SPACING.sm, justifyContent: "center", minHeight: 52, marginTop: DAYMARK_SPACING.xl },
  addButtonText: { ...DAYMARK_TYPE.label, color: DAYMARK_COLORS.white },
  addRow: { alignItems: "center", backgroundColor: DAYMARK_COLORS.surface, borderColor: DAYMARK_COLORS.border, borderRadius: DAYMARK_RADII.surface, borderWidth: 1, flexDirection: "row", gap: DAYMARK_SPACING.sm, marginTop: DAYMARK_SPACING.xl, padding: DAYMARK_SPACING.sm },
  input: { ...DAYMARK_TYPE.body, color: DAYMARK_COLORS.text, flex: 1, minHeight: 44, paddingHorizontal: DAYMARK_SPACING.sm },
  addIconButton: { alignItems: "center", backgroundColor: DAYMARK_COLORS.black, borderRadius: DAYMARK_RADII.control, height: 44, justifyContent: "center", width: 44 },
  addIconButtonDisabled: { backgroundColor: DAYMARK_COLORS.surfaceMuted },
  errorText: { ...DAYMARK_TYPE.small, color: DAYMARK_COLORS.danger, marginTop: DAYMARK_SPACING.sm, textAlign: "center" },
});
