import { router } from "expo-router";
import { useDaymarkColors } from "@/hooks/use-daymark-theme";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Container } from "@/components/container";
import { DAYMARK_RADII, DAYMARK_SPACING, DAYMARK_TYPE, type DaymarkColors } from "@/constants/daymark";
import { hapticLight } from "@/utils/haptics";

const viewOptions = [
  "Overdue tasks",
  "Completed tasks",
  "Date and time",
];

function closeModal() {
  hapticLight();
  router.back();
}

export default function Modal() {
  const colors = useDaymarkColors();
  const styles = makeStyles(colors);

  return (
    <Container isScrollable={false} style={styles.container}>
      <View style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <Pressable onPress={closeModal} accessibilityRole="button"><Text style={styles.headerAction}>Cancel</Text></Pressable>
          <Text style={styles.headerTitle}>View</Text>
          <Pressable onPress={closeModal} accessibilityRole="button"><Text style={styles.headerAction}>Done</Text></Pressable>
        </View>
        <Text style={styles.sectionLabel}>Shown in list</Text>
        <View style={styles.group}>
          {viewOptions.map((label, index) => (
            <View key={label} style={[styles.row, index === viewOptions.length - 1 && styles.rowLast]}>
              <Text style={styles.rowLabel}>{label}</Text>
              <View style={styles.toggle}><View style={styles.toggleThumb} /></View>
            </View>
          ))}
        </View>
        <Text style={styles.sectionLabel}>Filter</Text>
        <View style={styles.group}>
          <View style={[styles.row, styles.rowLast]}>
            <Text style={styles.rowLabel}>Filter</Text>
            <Text style={styles.rowValue}>All tasks</Text>
          </View>
        </View>
      </View>
    </Container>
  );
}

function makeStyles(colors: DaymarkColors) {
  return StyleSheet.create({
  container: { backgroundColor: colors.canvas },
  sheet: { flex: 1, paddingHorizontal: DAYMARK_SPACING.xl, paddingTop: DAYMARK_SPACING.lg },
  sheetHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", minHeight: 44 },
  headerAction: { ...DAYMARK_TYPE.body, color: colors.text },
  headerTitle: { ...DAYMARK_TYPE.label, color: colors.text },
  sectionLabel: { ...DAYMARK_TYPE.small, color: colors.textMuted, fontWeight: "600", marginBottom: DAYMARK_SPACING.sm, marginTop: DAYMARK_SPACING.xl, textTransform: "uppercase" },
  group: { backgroundColor: colors.surface, borderRadius: DAYMARK_RADII.surface, elevation: 2, paddingHorizontal: DAYMARK_SPACING.lg, shadowColor: colors.black, shadowOffset: { height: 3, width: 0 }, shadowOpacity: 0.06, shadowRadius: 12 },
  row: { alignItems: "center", borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: "row", gap: DAYMARK_SPACING.sm, minHeight: 52 },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: { ...DAYMARK_TYPE.body, color: colors.text, flex: 1 },
  rowValue: { ...DAYMARK_TYPE.small, color: colors.textMuted },
  toggle: { backgroundColor: colors.black, borderRadius: DAYMARK_RADII.round, height: 22, justifyContent: "center", paddingHorizontal: 2, width: 38 },
  toggleThumb: { alignSelf: "flex-end", backgroundColor: colors.white, borderRadius: DAYMARK_RADII.round, height: 18, width: 18 },
  });
}
