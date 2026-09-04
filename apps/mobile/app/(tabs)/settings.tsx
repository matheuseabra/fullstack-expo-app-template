import { ArrowSquareOutIcon, BellIcon, CalendarBlankIcon, CaretRightIcon, CodeIcon, FileTextIcon, ShieldCheckIcon, SunIcon, type Icon } from "phosphor-react-native";
import { useRouter } from "expo-router";
import { Container } from "@/components/container";
import { ScreenHeader } from "@/components/daymark-navigation";
import { DAYMARK_RADII, DAYMARK_SPACING, DAYMARK_TYPE, type DaymarkColors } from "@/constants/daymark";
import { useDaymarkColors } from "@/hooks/use-daymark-theme";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { hapticWarning } from "@/utils/haptics";

const settings: Array<{ label: string; Icon: Icon }> = [
  { label: "Notifications", Icon: BellIcon },
  { label: "Week starts on", Icon: CalendarBlankIcon },
  { label: "Appearance", Icon: SunIcon },
];

const legalLinks: Array<{ label: string; url: string; Icon: Icon }> = [
  { label: "Terms of Service", url: process.env.EXPO_PUBLIC_TERMS_URL ?? "https://daymark.app/terms", Icon: FileTextIcon },
  { label: "Privacy Policy", url: process.env.EXPO_PUBLIC_PRIVACY_URL ?? "https://daymark.app/privacy", Icon: ShieldCheckIcon },
];

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useDaymarkColors();
  const styles = makeStyles(colors);
  const resetOnboarding = useOnboardingStore((state) => state.reset);

  const handleResetOnboarding = () => {
    hapticWarning();
    void resetOnboarding().then(() => router.replace("/onboarding"));
  };

  const handleOpenLink = (url: string) => {
    void Linking.openURL(url).catch(() => undefined);
  };

  return (
    <Container style={styles.container}>
      <ScreenHeader title="Settings" />
      <View style={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.pageTitle}>Settings</Text>
        </View>
        <Text style={styles.sectionLabel}>Preferences</Text>
        <View style={styles.list}>
          {settings.map(({ label, Icon }, index) => (
            <Pressable key={label} style={[styles.row, index === settings.length - 1 && styles.rowLast]} accessibilityRole="button">
              <Icon size={22} weight="bold" color={colors.text} />
              <View style={styles.rowCopy}>
                <Text style={styles.rowLabel}>{label}</Text>
              </View>
              <CaretRightIcon size={18} weight="bold" color={colors.textMuted} />
            </Pressable>
          ))}
        </View>
        <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>Legal</Text>
        <View style={styles.list}>
          {legalLinks.map(({ label, url, Icon }, index) => (
            <Pressable key={label} style={[styles.row, index === legalLinks.length - 1 && styles.rowLast]} onPress={() => handleOpenLink(url)} accessibilityRole="link" accessibilityLabel={label} accessibilityHint="Opens in your browser">
              <Icon size={22} weight="bold" color={colors.text} />
              <View style={styles.rowCopy}>
                <Text style={styles.rowLabel}>{label}</Text>
              </View>
              <ArrowSquareOutIcon size={18} weight="bold" color={colors.textMuted} />
            </Pressable>
          ))}
        </View>
        <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>Developer</Text>
        <View style={styles.list}>
          <Pressable style={[styles.row, styles.rowLast]} onPress={handleResetOnboarding} accessibilityRole="button" accessibilityLabel="Reset onboarding">
            <CodeIcon size={22} weight="bold" color={colors.text} />
            <View style={styles.rowCopy}>
              <Text style={styles.rowLabel}>Reset onboarding</Text>
            </View>
            <CaretRightIcon size={18} weight="bold" color={colors.textMuted} />
          </Pressable>
        </View>
      </View>
    </Container>
  );
}

function makeStyles(colors: DaymarkColors) {
  return StyleSheet.create({
  container: { backgroundColor: colors.canvas },
  content: { paddingHorizontal: DAYMARK_SPACING.xl, paddingBottom: DAYMARK_SPACING.xl },
  heading: { marginBottom: DAYMARK_SPACING.xxl, marginTop: DAYMARK_SPACING.xxl },
  pageTitle: { ...DAYMARK_TYPE.pageTitle, color: colors.text },
  sectionLabel: { ...DAYMARK_TYPE.small, color: colors.textMuted, fontWeight: "400", letterSpacing: 0, marginBottom: DAYMARK_SPACING.sm },
  sectionLabelSpaced: { marginTop: DAYMARK_SPACING.xl },
  list: { backgroundColor: colors.surface, borderRadius: DAYMARK_RADII.surface, elevation: 2, paddingHorizontal: DAYMARK_SPACING.lg, shadowColor: colors.black, shadowOffset: { height: 3, width: 0 }, shadowOpacity: 0.06, shadowRadius: 12 },
  row: { alignItems: "center", borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: "row", gap: DAYMARK_SPACING.md, minHeight: 56 },
  rowLast: { borderBottomWidth: 0 },
  rowCopy: { flex: 1 },
  rowLabel: { ...DAYMARK_TYPE.body, color: colors.text, fontWeight: "600" },
  });
}
