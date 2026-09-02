import { useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Container } from "@/components/container";
import { DAYMARK_COLORS, DAYMARK_RADII, DAYMARK_SPACING, DAYMARK_TYPE } from "@/constants/daymark";
import { useTodos } from "@/hooks/use-todos";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + offset);
  result.setHours(0, 0, 0, 0);
  return result;
}

function isSameDay(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
}

function formatDate(date: Date, options: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString("en-US", options);
}

export default function WeekScreen() {
  const { taskList, isLoading, isError, refetch } = useTodos();
  const today = new Date();
  const weekStart = startOfWeek(today);
  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  }), [weekStart.getTime()]);
  const weekTasks = taskList.filter((task) => task.createdAt !== null && new Date(task.createdAt) >= weekStart && new Date(task.createdAt) < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000));
  const completedCount = weekTasks.filter((task) => task.completed).length;
  const dayStats = days.map((date) => {
    const tasks = weekTasks.filter((task) => task.createdAt !== null && isSameDay(new Date(task.createdAt), date));
    return { date, tasks, completed: tasks.filter((task) => task.completed).length };
  });
  const progress = weekTasks.length === 0 ? 0 : completedCount / weekTasks.length;

  return (
    <Container isScrollable={false} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Week</Text>
        <Text style={styles.dateRange}>{formatDate(weekStart, { month: "short", day: "numeric" })} — {formatDate(days[6], { month: "short", day: "numeric" })}</Text>
        <View style={styles.calendarRow}>
          {dayStats.map(({ date }) => {
            const active = isSameDay(date, today);
            return (
              <View key={date.toISOString()} style={styles.calendarDay}>
                <Text style={styles.calendarLabel}>{formatDate(date, { weekday: "short" }).slice(0, 1)}</Text>
                <View style={[styles.calendarDate, active && styles.calendarDateActive]}>
                  <Text style={[styles.calendarDateText, active && styles.calendarDateTextActive]}>{date.getDate()}</Text>
                </View>
              </View>
            );
          })}
        </View>
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Weekly progress</Text>
          <Text style={styles.progressMeta}>{completedCount} of {weekTasks.length} done</Text>
          <View style={styles.track}><View style={[styles.fill, { width: `${progress * 100}%` }]} /></View>
        </View>
        {isLoading ? (
          <View style={styles.statusState}><Text style={styles.statusText}>Loading your week…</Text></View>
        ) : isError ? (
          <View style={styles.statusState}>
            <Text style={styles.statusText}>We couldn’t load your week.</Text>
            <Pressable onPress={() => refetch()} accessibilityRole="button"><Text style={styles.retryText}>Try again</Text></Pressable>
          </View>
        ) : (
          <View style={styles.dayList}>
            {dayStats.map(({ date, tasks, completed }) => {
              const dayProgress = tasks.length === 0 ? 0 : completed / tasks.length;
              return (
                <View key={date.toISOString()} style={styles.dayRow}>
                  <View style={styles.dayNameWrap}>
                    {tasks.length > 0 && completed === tasks.length ? <Ionicons name="checkmark-circle" size={18} color={DAYMARK_COLORS.black} /> : null}
                    <Text style={styles.dayName}>{formatDate(date, { weekday: "long" })}</Text>
                  </View>
                  <Text style={styles.dayCount}>{completed} of {tasks.length}</Text>
                  <View style={styles.dayTrack}><View style={[styles.dayFill, { width: `${dayProgress * 100}%` }]} /></View>
                  <Ionicons name="chevron-forward" size={16} color={DAYMARK_COLORS.textMuted} />
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: DAYMARK_COLORS.canvas },
  content: { padding: DAYMARK_SPACING.xl, paddingBottom: DAYMARK_SPACING.xxl },
  pageTitle: { ...DAYMARK_TYPE.pageTitle, color: DAYMARK_COLORS.text, marginTop: DAYMARK_SPACING.xl },
  dateRange: { ...DAYMARK_TYPE.body, color: DAYMARK_COLORS.textMuted, marginTop: DAYMARK_SPACING.sm },
  calendarRow: { flexDirection: "row", justifyContent: "space-between", marginTop: DAYMARK_SPACING.xxl },
  calendarDay: { alignItems: "center", gap: DAYMARK_SPACING.sm },
  calendarLabel: { ...DAYMARK_TYPE.small, color: DAYMARK_COLORS.textMuted },
  calendarDate: { alignItems: "center", height: 32, justifyContent: "center", width: 32 },
  calendarDateActive: { backgroundColor: DAYMARK_COLORS.black, borderRadius: DAYMARK_RADII.round },
  calendarDateText: { ...DAYMARK_TYPE.body, color: DAYMARK_COLORS.text },
  calendarDateTextActive: { color: DAYMARK_COLORS.white, fontWeight: "600" },
  progressCard: { backgroundColor: DAYMARK_COLORS.surface, borderColor: DAYMARK_COLORS.border, borderRadius: DAYMARK_RADII.surface, borderWidth: 1, marginTop: DAYMARK_SPACING.xxl, padding: DAYMARK_SPACING.lg },
  progressTitle: { ...DAYMARK_TYPE.small, color: DAYMARK_COLORS.textMuted },
  progressMeta: { ...DAYMARK_TYPE.body, color: DAYMARK_COLORS.text, marginTop: DAYMARK_SPACING.xs },
  track: { backgroundColor: DAYMARK_COLORS.surfaceMuted, borderRadius: DAYMARK_RADII.round, height: 6, marginTop: DAYMARK_SPACING.md, overflow: "hidden" },
  fill: { backgroundColor: DAYMARK_COLORS.black, borderRadius: DAYMARK_RADII.round, height: "100%" },
  dayList: { marginTop: DAYMARK_SPACING.lg },
  dayRow: { alignItems: "center", borderBottomColor: DAYMARK_COLORS.border, borderBottomWidth: 1, flexDirection: "row", gap: DAYMARK_SPACING.sm, minHeight: 48 },
  dayNameWrap: { alignItems: "center", flexDirection: "row", flex: 1, gap: DAYMARK_SPACING.sm },
  dayName: { ...DAYMARK_TYPE.body, color: DAYMARK_COLORS.text },
  dayCount: { ...DAYMARK_TYPE.small, color: DAYMARK_COLORS.textMuted, width: 45 },
  dayTrack: { backgroundColor: DAYMARK_COLORS.surfaceMuted, borderRadius: DAYMARK_RADII.round, height: 5, overflow: "hidden", width: 70 },
  dayFill: { backgroundColor: DAYMARK_COLORS.black, borderRadius: DAYMARK_RADII.round, height: "100%" },
  statusState: { alignItems: "center", backgroundColor: DAYMARK_COLORS.surface, borderColor: DAYMARK_COLORS.border, borderRadius: DAYMARK_RADII.surface, borderWidth: 1, marginTop: DAYMARK_SPACING.lg, padding: DAYMARK_SPACING.xl },
  statusText: { ...DAYMARK_TYPE.body, color: DAYMARK_COLORS.textMuted },
  retryText: { ...DAYMARK_TYPE.label, color: DAYMARK_COLORS.text, marginTop: DAYMARK_SPACING.md },
});
