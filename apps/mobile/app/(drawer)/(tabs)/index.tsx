import { Ionicons } from "@expo/vector-icons";
import { Container } from "@/components/container";
import { DAYMARK_COLORS, DAYMARK_RADII, DAYMARK_SPACING, DAYMARK_TYPE } from "@/constants/daymark";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const days = [
  { name: "Monday", count: "2 of 3", progress: 70 },
  { name: "Tuesday", count: "1 of 3", progress: 35 },
  { name: "Wednesday", count: "1 of 3", progress: 35 },
  { name: "Thursday", count: "0 of 3", progress: 0 },
  { name: "Friday", count: "0 of 3", progress: 0 },
  { name: "Saturday", count: "0 of 0", progress: 0 },
  { name: "Sunday", count: "0 of 0", progress: 0 },
] as const;

export default function WeekScreen() {
  return (
    <Container isScrollable={false} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Week</Text>
        <Text style={styles.dateRange}>May 12 — May 18</Text>
        <View style={styles.calendarRow}>
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <View key={`${day}-${index}`} style={styles.calendarDay}>
              <Text style={styles.calendarLabel}>{day}</Text>
              <View style={[styles.calendarDate, index === 2 && styles.calendarDateActive]}>
                <Text style={[styles.calendarDateText, index === 2 && styles.calendarDateTextActive]}>{12 + index}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Weekly progress</Text>
          <Text style={styles.progressMeta}>4 of 12 done</Text>
          <View style={styles.track}><View style={styles.fill} /></View>
        </View>
        <View style={styles.dayList}>
          {days.map((day, index) => (
            <View key={day.name} style={styles.dayRow}>
              <View style={styles.dayNameWrap}>
                {index === 2 ? <Ionicons name="checkmark-circle" size={18} color={DAYMARK_COLORS.black} /> : null}
                <Text style={styles.dayName}>{day.name}</Text>
              </View>
              <Text style={styles.dayCount}>{day.count}</Text>
              <View style={styles.dayTrack}><View style={[styles.dayFill, { width: `${day.progress}%` }]} /></View>
              <Ionicons name="chevron-forward" size={16} color={DAYMARK_COLORS.textMuted} />
            </View>
          ))}
        </View>
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
  fill: { backgroundColor: DAYMARK_COLORS.black, borderRadius: DAYMARK_RADII.round, height: "100%", width: "33%" },
  dayList: { marginTop: DAYMARK_SPACING.lg },
  dayRow: { alignItems: "center", borderBottomColor: DAYMARK_COLORS.border, borderBottomWidth: 1, flexDirection: "row", gap: DAYMARK_SPACING.sm, minHeight: 48 },
  dayNameWrap: { alignItems: "center", flexDirection: "row", flex: 1, gap: DAYMARK_SPACING.sm },
  dayName: { ...DAYMARK_TYPE.body, color: DAYMARK_COLORS.text },
  dayCount: { ...DAYMARK_TYPE.small, color: DAYMARK_COLORS.textMuted, width: 45 },
  dayTrack: { backgroundColor: DAYMARK_COLORS.surfaceMuted, borderRadius: DAYMARK_RADII.round, height: 5, overflow: "hidden", width: 70 },
  dayFill: { backgroundColor: DAYMARK_COLORS.black, borderRadius: DAYMARK_RADII.round, height: "100%" },
});
