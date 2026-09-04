import { useMemo, useState } from "react";
import { CalendarBlankIcon, CaretRightIcon, CheckCircleIcon, ListIcon } from "phosphor-react-native";
import Animated, { FadeOut, LinearTransition } from "react-native-reanimated";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Container } from "@/components/container";
import { ScreenHeader } from "@/components/daymark-navigation";
import { DAYMARK_RADII, DAYMARK_SPACING, DAYMARK_TYPE, type DaymarkColors } from "@/constants/daymark";
import { useDaymarkColors } from "@/hooks/use-daymark-theme";
import { useTodos } from "@/hooks/use-todos";

type ViewMode = "calendar" | "list";
type WeekTask = { id: number; text: string; completed: boolean };
type DayStats = { date: Date; tasks: WeekTask[]; completed: number };

function startOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() + (day === 0 ? -6 : 1 - day));
  result.setHours(0, 0, 0, 0);
  return result;
}

function isSameDay(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate();
}

function formatDate(date: Date, options: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString("en-US", options);
}

function taskLabel(count: number) {
  return `${count} ${count === 1 ? "task" : "tasks"}`;
}

function ModeToggle({ mode, onChange, colors, styles }: { mode: ViewMode; onChange: (next: ViewMode) => void; colors: DaymarkColors; styles: ReturnType<typeof makeStyles> }) {
  return (
    <View style={styles.modeToggle}>
      {(["calendar", "list"] as const).map((option) => {
        const active = mode === option;
        const Icon = option === "calendar" ? CalendarBlankIcon : ListIcon;
        return <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} key={option} onPress={() => onChange(option)} style={[styles.modeButton, active && styles.modeButtonActive]}><Icon color={active ? colors.text : colors.textMuted} size={17} weight={active ? "fill" : "bold"} /><Text style={[styles.modeLabel, active && styles.modeLabelActive]}>{option === "calendar" ? "Calendar" : "List"}</Text></Pressable>;
      })}
    </View>
  );
}

function CalendarView({ days, dayStats, today, selectedDate, setSelectedDate, colors, styles }: { days: Date[]; dayStats: DayStats[]; today: Date; selectedDate: Date; setSelectedDate: (date: Date) => void; colors: DaymarkColors; styles: ReturnType<typeof makeStyles> }) {
  const selectedStats = dayStats.find(({ date }) => isSameDay(date, selectedDate));
  const openTasks = selectedStats?.tasks.filter((task) => !task.completed) ?? [];

  return (
    <>
      <View style={styles.calendarCard}>
        <View style={styles.cardHeader}><Text style={styles.cardTitle}>This week</Text><Text style={styles.cardMeta}>{dayStats.reduce((total, day) => total + day.completed, 0)} done</Text></View>
        <View style={styles.calendarRow}>
          {days.map((date) => {
            const stats = dayStats.find((day) => isSameDay(day.date, date));
            const active = isSameDay(date, selectedDate);
            return <Pressable accessibilityRole="button" accessibilityLabel={formatDate(date, { weekday: "long", month: "long", day: "numeric" })} key={date.toISOString()} onPress={() => setSelectedDate(date)} style={styles.calendarDay}><Text style={styles.calendarLabel}>{formatDate(date, { weekday: "short" }).slice(0, 1)}</Text><View style={[styles.calendarDate, active && styles.calendarDateActive, !active && isSameDay(date, today) && styles.calendarDateToday]}><Text style={[styles.calendarDateText, active && styles.calendarDateTextActive]}>{date.getDate()}</Text></View><Text style={styles.calendarCount}>{stats?.tasks.length ?? 0}</Text></Pressable>;
          })}
        </View>
      </View>
      <View style={styles.selectedDayCard}>
        <View style={styles.cardHeader}><Text style={styles.cardTitle}>{formatDate(selectedDate, { weekday: "long" })}</Text><Text style={styles.cardMeta}>{taskLabel(selectedStats?.tasks.length ?? 0)}</Text></View>
        {openTasks.length === 0 ? <Text style={styles.statusText}>No open tasks.</Text> : <View style={styles.taskList}>{openTasks.map((task) => <Animated.View exiting={FadeOut.duration(180)} layout={LinearTransition.duration(180)} key={task.id} style={styles.taskRow}><View style={styles.taskCheck} /><Text style={styles.taskText}>{task.text}</Text></Animated.View>)}</View>}
      </View>
    </>
  );
}

function ListView({ dayStats, isLoading, isError, refetch, colors, styles }: { dayStats: DayStats[]; isLoading: boolean; isError: boolean; refetch: () => void; colors: DaymarkColors; styles: ReturnType<typeof makeStyles> }) {
  if (isLoading) return <View style={styles.statusState}><Text style={styles.statusText}>Loading your week…</Text></View>;
  if (isError) return <View style={styles.statusState}><Text style={styles.statusText}>We couldn’t load your week.</Text><Pressable onPress={() => refetch()} accessibilityRole="button"><Text style={styles.retryText}>Try again</Text></Pressable></View>;
  return <View style={styles.dayListCard}>{dayStats.map(({ date, tasks, completed }) => { const dayProgress = tasks.length === 0 ? 0 : completed / tasks.length; return <View key={date.toISOString()} style={styles.dayRow}><View style={styles.dayNameWrap}>{tasks.length > 0 && completed === tasks.length ? <CheckCircleIcon color={colors.black} size={18} weight="fill" /> : null}<Text style={styles.dayName}>{formatDate(date, { weekday: "long" })}</Text></View><Text style={styles.dayCount}>{completed} of {tasks.length}</Text><View style={styles.dayTrack}><View style={[styles.dayFill, { width: `${dayProgress * 100}%` }]} /></View><CaretRightIcon color={colors.textMuted} size={17} weight="bold" /></View>; })}</View>;
}

export default function WeekScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const colors = useDaymarkColors();
  const styles = makeStyles(colors);
  const { taskList, isLoading, isError, refetch } = useTodos();
  const today = new Date();
  const weekStart = startOfWeek(today);
  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => { const date = new Date(weekStart); date.setDate(weekStart.getDate() + index); return date; }), [weekStart.getTime()]);
  const dayStats = days.map((date) => { const tasks = taskList.filter((task) => task.createdAt !== null && isSameDay(new Date(task.createdAt), date)); return { date, tasks, completed: tasks.filter((task) => task.completed).length }; });

  return (
    <Container isScrollable={false} style={styles.container}>
      <ScreenHeader title="Week" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heading}><Text style={styles.pageTitle}>Week</Text><Text style={styles.subtitle}>{formatDate(weekStart, { month: "short", day: "numeric" })} — {formatDate(days[6], { month: "short", day: "numeric" })}</Text></View>
        <ModeToggle colors={colors} mode={viewMode} onChange={setViewMode} styles={styles} />
        {viewMode === "calendar" ? <CalendarView colors={colors} dayStats={dayStats} days={days} selectedDate={selectedDate} setSelectedDate={setSelectedDate} styles={styles} today={today} /> : <ListView colors={colors} dayStats={dayStats} isError={isError} isLoading={isLoading} refetch={refetch} styles={styles} />}
      </ScrollView>
    </Container>
  );
}

function makeStyles(colors: DaymarkColors) {
  return StyleSheet.create({
    container: { backgroundColor: colors.canvas },
    content: { paddingBottom: 160, paddingHorizontal: DAYMARK_SPACING.xl },
    heading: { marginBottom: DAYMARK_SPACING.lg, marginTop: DAYMARK_SPACING.xxl },
    pageTitle: { ...DAYMARK_TYPE.pageTitle, color: colors.text },
    subtitle: { ...DAYMARK_TYPE.small, color: colors.textMuted, marginTop: DAYMARK_SPACING.xs },
    modeToggle: { alignSelf: "flex-start", backgroundColor: colors.surfaceMuted, borderRadius: DAYMARK_RADII.round, flexDirection: "row", marginBottom: DAYMARK_SPACING.lg, padding: 3 },
    modeButton: { alignItems: "center", borderRadius: DAYMARK_RADII.round, flexDirection: "row", gap: DAYMARK_SPACING.xs, minHeight: 34, paddingHorizontal: DAYMARK_SPACING.md },
    modeButtonActive: { backgroundColor: colors.surface, elevation: 1, shadowColor: colors.black, shadowOpacity: 0.06, shadowRadius: 4 },
    modeLabel: { ...DAYMARK_TYPE.small, color: colors.textMuted },
    modeLabelActive: { color: colors.text, fontWeight: "600" },
    calendarCard: { backgroundColor: colors.surfaceMuted, borderRadius: DAYMARK_RADII.surface, padding: DAYMARK_SPACING.lg },
    cardHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
    cardTitle: { ...DAYMARK_TYPE.label, color: colors.text },
    cardMeta: { ...DAYMARK_TYPE.small, color: colors.textMuted },
    calendarRow: { flexDirection: "row", justifyContent: "space-between", marginTop: DAYMARK_SPACING.lg },
    calendarDay: { alignItems: "center", gap: DAYMARK_SPACING.xs, minWidth: 32 },
    calendarLabel: { ...DAYMARK_TYPE.small, color: colors.textMuted },
    calendarDate: { alignItems: "center", borderRadius: DAYMARK_RADII.round, height: 30, justifyContent: "center", width: 30 },
    calendarDateActive: { backgroundColor: colors.black },
    calendarDateToday: { borderColor: colors.borderStrong, borderWidth: 1 },
    calendarDateText: { ...DAYMARK_TYPE.small, color: colors.text },
    calendarDateTextActive: { color: colors.white, fontWeight: "600" },
    calendarCount: { ...DAYMARK_TYPE.small, color: colors.textMuted },
    selectedDayCard: { backgroundColor: colors.surface, borderRadius: DAYMARK_RADII.surface, marginTop: DAYMARK_SPACING.lg, padding: DAYMARK_SPACING.lg },
    taskList: { marginTop: DAYMARK_SPACING.md },
    taskRow: { alignItems: "center", flexDirection: "row", gap: DAYMARK_SPACING.md, minHeight: 44 },
    taskCheck: { borderColor: colors.borderStrong, borderRadius: DAYMARK_RADII.round, borderWidth: 2, height: 24, width: 24 },
    taskText: { ...DAYMARK_TYPE.body, color: colors.text, flex: 1 },
    dayListCard: { marginTop: DAYMARK_SPACING.xl },
    dayRow: { alignItems: "center", borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: "row", gap: DAYMARK_SPACING.sm, minHeight: 64 },
    dayNameWrap: { alignItems: "center", flex: 1, flexDirection: "row", gap: DAYMARK_SPACING.sm },
    dayName: { ...DAYMARK_TYPE.body, color: colors.text },
    dayCount: { ...DAYMARK_TYPE.small, color: colors.textMuted, width: 40 },
    dayTrack: { backgroundColor: colors.surfaceMuted, borderRadius: DAYMARK_RADII.round, height: 4, overflow: "hidden", width: 54 },
    dayFill: { backgroundColor: colors.black, borderRadius: DAYMARK_RADII.round, height: "100%" },
    statusState: { alignItems: "center", paddingVertical: DAYMARK_SPACING.xl },
    statusText: { ...DAYMARK_TYPE.small, color: colors.textMuted },
    retryText: { ...DAYMARK_TYPE.label, color: colors.text, marginTop: DAYMARK_SPACING.sm },
  });
}
