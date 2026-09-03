import { useMemo } from "react";
import { CaretRightIcon, CheckCircleIcon } from "phosphor-react-native";
import { Container } from "@/components/container";
import { ScreenHeader } from "@/components/daymark-navigation";
import { DAYMARK_RADII, DAYMARK_SPACING, DAYMARK_TYPE, type DaymarkColors } from "@/constants/daymark";
import { useDaymarkColors } from "@/hooks/use-daymark-theme";
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
  const colors = useDaymarkColors();
  const styles = makeStyles(colors);
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
      <ScreenHeader title="Week" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heading}>
          <Text style={styles.pageTitle}>Week</Text>
          <Text style={styles.subtitle}>{formatDate(weekStart, { month: "short", day: "numeric" })} — {formatDate(days[6], { month: "short", day: "numeric" })}</Text>
        </View>
        <View style={styles.calendarCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>This week</Text>
            <Text style={styles.cardMeta}>{completedCount} of {weekTasks.length} done</Text>
          </View>
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
          <View style={styles.track}><View style={[styles.fill, { width: `${progress * 100}%` }]} /></View>
        </View>
        <View style={styles.dayListCard}>
          {isLoading ? (
            <View style={styles.statusState}><Text style={styles.statusText}>Loading your week…</Text></View>
          ) : isError ? (
            <View style={styles.statusState}>
              <Text style={styles.statusText}>We couldn’t load your week.</Text>
              <Pressable onPress={() => refetch()} accessibilityRole="button"><Text style={styles.retryText}>Try again</Text></Pressable>
            </View>
          ) : (
            dayStats.map(({ date, tasks, completed }) => {
              const dayProgress = tasks.length === 0 ? 0 : completed / tasks.length;
              return (
                <View key={date.toISOString()} style={styles.dayRow}>
                  <View style={styles.dayNameWrap}>
                    {tasks.length > 0 && completed === tasks.length ? <CheckCircleIcon size={18} weight="fill" color={colors.black} /> : null}
                    <Text style={styles.dayName}>{formatDate(date, { weekday: "long" })}</Text>
                  </View>
                  <Text style={styles.dayCount}>{completed} of {tasks.length}</Text>
                  <View style={styles.dayTrack}><View style={[styles.dayFill, { width: `${dayProgress * 100}%` }]} /></View>
                  <CaretRightIcon size={17} weight="bold" color={colors.textMuted} />
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </Container>
  );
}

function makeStyles(colors: DaymarkColors) {
  return StyleSheet.create({
  container: { backgroundColor: colors.canvas },
  content: { paddingBottom: 160, paddingHorizontal: DAYMARK_SPACING.xl },
  heading: { marginBottom: DAYMARK_SPACING.xl, marginTop: DAYMARK_SPACING.xxl },
  pageTitle: { ...DAYMARK_TYPE.pageTitle, color: colors.text },
  subtitle: { ...DAYMARK_TYPE.small, color: colors.textMuted, marginTop: DAYMARK_SPACING.xs },
  calendarCard: { backgroundColor: colors.surfaceMuted, borderRadius: DAYMARK_RADII.surface, padding: DAYMARK_SPACING.xl },
  cardHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  cardTitle: { ...DAYMARK_TYPE.label, color: colors.text },
  cardMeta: { ...DAYMARK_TYPE.small, color: colors.textMuted },
  calendarRow: { flexDirection: "row", justifyContent: "space-between", marginTop: DAYMARK_SPACING.lg },
  calendarDay: { alignItems: "center", gap: DAYMARK_SPACING.sm },
  calendarLabel: { ...DAYMARK_TYPE.small, color: colors.textMuted },
  calendarDate: { alignItems: "center", height: 28, justifyContent: "center", width: 28 },
  calendarDateActive: { backgroundColor: colors.black, borderRadius: DAYMARK_RADII.round },
  calendarDateText: { ...DAYMARK_TYPE.small, color: colors.text },
  calendarDateTextActive: { color: colors.white, fontWeight: "600" },
  track: { backgroundColor: colors.surfaceMuted, borderRadius: DAYMARK_RADII.round, height: 5, marginTop: DAYMARK_SPACING.lg, overflow: "hidden" },
  fill: { backgroundColor: colors.black, borderRadius: DAYMARK_RADII.round, height: "100%" },
  dayListCard: { marginTop: DAYMARK_SPACING.xl },
  dayRow: { alignItems: "center", borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: "row", gap: DAYMARK_SPACING.sm, minHeight: 64 },
  dayNameWrap: { alignItems: "center", flexDirection: "row", flex: 1, gap: DAYMARK_SPACING.sm },
  dayName: { ...DAYMARK_TYPE.body, color: colors.text },
  dayCount: { ...DAYMARK_TYPE.small, color: colors.textMuted, width: 40 },
  dayTrack: { backgroundColor: colors.surfaceMuted, borderRadius: DAYMARK_RADII.round, height: 4, overflow: "hidden", width: 54 },
  dayFill: { backgroundColor: colors.black, borderRadius: DAYMARK_RADII.round, height: "100%" },
  statusState: { alignItems: "center", paddingVertical: DAYMARK_SPACING.xl },
  statusText: { ...DAYMARK_TYPE.small, color: colors.textMuted },
  retryText: { ...DAYMARK_TYPE.label, color: colors.text, marginTop: DAYMARK_SPACING.sm },
  });
}
