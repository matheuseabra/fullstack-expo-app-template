import { Ionicons } from "@expo/vector-icons";
import { Container } from "@/components/container";
import { DAYMARK_COLORS, DAYMARK_RADII, DAYMARK_SPACING, DAYMARK_TYPE } from "@/constants/daymark";
import { Pressable, StyleSheet, Text, View } from "react-native";

const settings = [
  ["Notifications", "A quiet nudge when it helps"],
  ["Week starts on", "Monday"],
  ["Appearance", "Light"],
];

export default function SettingsScreen() {
  return (
    <Container isScrollable={false} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}><Ionicons name="settings-outline" size={28} color={DAYMARK_COLORS.text} /></View>
        <Text style={styles.pageTitle}>Settings</Text>
        <Text style={styles.subtitle}>Make Daymark fit the way you work.</Text>
        <View style={styles.list}>
          {settings.map(([label, value]) => (
            <Pressable key={label} style={styles.row} accessibilityRole="button">
              <View style={styles.rowCopy}><Text style={styles.rowLabel}>{label}</Text><Text style={styles.rowValue}>{value}</Text></View>
              <Ionicons name="chevron-forward" size={17} color={DAYMARK_COLORS.textMuted} />
            </Pressable>
          ))}
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: DAYMARK_COLORS.canvas },
  content: { padding: DAYMARK_SPACING.xl, paddingTop: 56 },
  iconWrap: { alignItems: "center", backgroundColor: DAYMARK_COLORS.surface, borderColor: DAYMARK_COLORS.border, borderRadius: DAYMARK_RADII.round, borderWidth: 1, height: 56, justifyContent: "center", width: 56 },
  pageTitle: { ...DAYMARK_TYPE.pageTitle, color: DAYMARK_COLORS.text, marginTop: DAYMARK_SPACING.xl },
  subtitle: { ...DAYMARK_TYPE.body, color: DAYMARK_COLORS.textMuted, marginTop: DAYMARK_SPACING.sm },
  list: { backgroundColor: DAYMARK_COLORS.surface, borderTopColor: DAYMARK_COLORS.border, borderTopWidth: 1, marginTop: 40 },
  row: { alignItems: "center", borderBottomColor: DAYMARK_COLORS.border, borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", minHeight: 68 },
  rowCopy: { gap: DAYMARK_SPACING.xs },
  rowLabel: { ...DAYMARK_TYPE.body, color: DAYMARK_COLORS.text },
  rowValue: { ...DAYMARK_TYPE.small, color: DAYMARK_COLORS.textMuted },
});
