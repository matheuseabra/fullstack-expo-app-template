import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Container } from "@/components/container";
import { OverflowButton } from "@/components/daymark-navigation";
import { DAYMARK_RADII, DAYMARK_SPACING, DAYMARK_TYPE, type DaymarkColors } from "@/constants/daymark";
import { useDaymarkColors } from "@/hooks/use-daymark-theme";
import { useTodos } from "@/hooks/use-todos";
import { hapticSelection, hapticSuccess } from "@/utils/haptics";

function TaskRow({ task, onToggle, disabled }: { task: { text: string; completed: boolean }; onToggle: () => void; disabled: boolean }) {
  const colors = useDaymarkColors();
  const styles = makeStyles(colors);

  return (
    <Pressable disabled={disabled} style={styles.taskRow} onPress={() => { task.completed ? hapticSelection() : hapticSuccess(); onToggle(); }} accessibilityRole="checkbox" accessibilityState={{ checked: task.completed }}>
      <View style={[styles.taskCheck, task.completed && styles.taskCheckDone]}>
        {task.completed ? <View style={styles.taskCheckInner} /> : null}
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
  const colors = useDaymarkColors();
  const styles = makeStyles(colors);
  const { taskList, isLoading, isError, refetch, isPending, isMutationError, toggleTodo } = useTodos();
  const completedCount = taskList.filter((task) => task.completed).length;
  const today = new Date();

  return (
    <Container isScrollable={false} style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + DAYMARK_SPACING.sm }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}><View /><OverflowButton /></View>
        <View style={styles.headingBlock}>
          <Text style={styles.pageTitle}>Today</Text>
          <Text style={styles.dateLine}>{formatToday(today)}</Text>
        </View>
        <View style={styles.todayCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardMeta}>{completedCount} of {taskList.length} done</Text>
          </View>
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
          {isMutationError ? <Text style={styles.errorText}>Couldn’t save that task. Try again.</Text> : null}
        </View>
      </ScrollView>
    </Container>
  );
}

function makeStyles(colors: DaymarkColors) {
  return StyleSheet.create({
  container: { backgroundColor: colors.canvas },
  content: { paddingBottom: 160, paddingHorizontal: DAYMARK_SPACING.xl },
  topRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  headingBlock: { marginBottom: DAYMARK_SPACING.xl, marginTop: DAYMARK_SPACING.xxl },
  pageTitle: { ...DAYMARK_TYPE.pageTitle, color: colors.text },
  dateLine: { ...DAYMARK_TYPE.small, color: colors.textMuted, marginTop: DAYMARK_SPACING.xs },
  todayCard: { marginTop: DAYMARK_SPACING.md },
  cardHeader: { alignItems: "center", flexDirection: "row", justifyContent: "flex-end", marginBottom: DAYMARK_SPACING.md },
  cardMeta: { ...DAYMARK_TYPE.small, color: colors.textMuted },
  taskList: { gap: DAYMARK_SPACING.sm },
  taskRow: { alignItems: "center", flexDirection: "row", gap: DAYMARK_SPACING.md, minHeight: 50 },
  taskCheck: { alignItems: "center", borderColor: colors.borderStrong, borderRadius: DAYMARK_RADII.round, borderWidth: 2, height: 28, justifyContent: "center", width: 28 },
  taskCheckDone: { backgroundColor: colors.black, borderColor: colors.black },
  taskCheckInner: { backgroundColor: colors.white, borderRadius: DAYMARK_RADII.round, height: 16, width: 16 },
  taskText: { ...DAYMARK_TYPE.body, color: colors.text, flex: 1 },
  taskTextDone: { color: colors.textMuted },
  statusState: { alignItems: "center", paddingVertical: DAYMARK_SPACING.lg },
  statusText: { ...DAYMARK_TYPE.small, color: colors.textMuted },
  retryText: { ...DAYMARK_TYPE.label, color: colors.text, marginTop: DAYMARK_SPACING.sm },
  errorText: { ...DAYMARK_TYPE.small, color: colors.danger, marginTop: DAYMARK_SPACING.sm, textAlign: "center" },
  });
}
