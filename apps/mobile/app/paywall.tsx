import { CheckCircleIcon, XIcon } from "phosphor-react-native";
import { useRouter } from "expo-router";
import { useColorScheme, Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Container } from "@/components/container";
import { DAYMARK_RADII, DAYMARK_SPACING, DAYMARK_TYPE, type DaymarkColors } from "@/constants/daymark";
import { useDaymarkColors } from "@/hooks/use-daymark-theme";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { hapticLight, hapticMedium } from "@/utils/haptics";

const icon = require("../assets/images/icon.png");
const darkIcon = require("../assets/images/icon-dark.png");

const benefits = ["Quick capture for every open loop", "One calm list for today", "A clear view of the week ahead"];

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const colors = useDaymarkColors();
  const styles = makeStyles(colors);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const complete = useOnboardingStore((state) => state.complete);

  const close = () => {
    hapticLight();
    void complete().then(() => router.replace("/(tabs)"));
  };

  const handlePurchase = () => {
    hapticMedium();
    Alert.alert("Daymark Plus", "The in-app purchase flow is mocked for now. You can keep using the free plan.", [{ text: "Continue to Daymark", onPress: close }]);
  };

  return (
    <Container isScrollable={false} style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + DAYMARK_SPACING.sm, paddingBottom: insets.bottom + DAYMARK_SPACING.xxl }]}>
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Pressable accessibilityRole="button" accessibilityLabel="Close Daymark Plus" onPress={close} style={styles.closeButton}>
            <XIcon color={colors.text} size={22} weight="bold" />
          </Pressable>
        </View>
        <View style={styles.copy}>
          <Image source={colorScheme === "dark" ? darkIcon : icon} style={styles.icon} />
          <Text style={styles.eyebrow}>Daymark Plus</Text>
          <Text style={styles.title}>Make more room for what matters.</Text>
          <Text style={styles.body}>Stay focused on the next right thing with a calmer way to plan, capture, and follow through.</Text>
          <View style={styles.benefitList}>
            {benefits.map((benefit) => (
              <View key={benefit} style={styles.benefitRow}>
                <CheckCircleIcon color={colors.text} size={20} weight="fill" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
          <View style={styles.offerCard}>
            <View style={styles.offerHeader}>
              <Text style={styles.offerLabel}>More clarity, when you need it.</Text>
              <Text style={styles.offerBadge}>Coming soon</Text>
            </View>
            <Text style={styles.offerBody}>Start with the essentials. Premium planning tools will be there when you’re ready.</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Start your free trial of Daymark Plus" onPress={handlePurchase} style={styles.ctaButton}>
            <Text style={styles.ctaText}>Start my free trial</Text>
          </Pressable>
        </View>
      </View>
    </Container>
  );
}

function makeStyles(colors: DaymarkColors) {
  return StyleSheet.create({
    container: { backgroundColor: colors.canvas },
    content: { flex: 1, paddingHorizontal: DAYMARK_SPACING.screen },
    header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
    headerSpacer: { height: 44, width: 44 },
    closeButton: { alignItems: "center", backgroundColor: colors.surface, borderRadius: DAYMARK_RADII.round, elevation: 2, height: 44, justifyContent: "center", shadowColor: colors.black, shadowOffset: { height: 4, width: 0 }, shadowOpacity: 0.07, shadowRadius: 12, width: 44 },
    copy: { alignItems: "center", flex: 1, justifyContent: "center", maxWidth: 330, width: "100%" },
    icon: { height: 64, marginBottom: DAYMARK_SPACING.md, width: 64 },
    eyebrow: { ...DAYMARK_TYPE.label, color: colors.textMuted },
    title: { ...DAYMARK_TYPE.pageTitle, color: colors.text, fontSize: 34, lineHeight: 40, marginTop: DAYMARK_SPACING.sm, textAlign: "center" },
    body: { ...DAYMARK_TYPE.body, color: colors.textMuted, marginTop: DAYMARK_SPACING.md, textAlign: "center" },
    benefitList: { alignSelf: "stretch", gap: DAYMARK_SPACING.sm, marginTop: DAYMARK_SPACING.xl },
    benefitRow: { alignItems: "center", flexDirection: "row", gap: DAYMARK_SPACING.sm },
    benefitText: { ...DAYMARK_TYPE.body, color: colors.text, flex: 1 },
    offerCard: { alignSelf: "stretch", backgroundColor: colors.surfaceMuted, borderRadius: DAYMARK_RADII.surface, marginTop: DAYMARK_SPACING.xl, padding: DAYMARK_SPACING.lg },
    offerHeader: { alignItems: "center", flexDirection: "row", gap: DAYMARK_SPACING.sm, justifyContent: "space-between" },
    offerLabel: { ...DAYMARK_TYPE.sectionTitle, color: colors.text, flex: 1 },
    offerBadge: { ...DAYMARK_TYPE.small, color: colors.textMuted },
    offerBody: { ...DAYMARK_TYPE.small, color: colors.textMuted, marginTop: DAYMARK_SPACING.xs },
    ctaButton: { alignItems: "center", alignSelf: "stretch", backgroundColor: colors.black, borderRadius: DAYMARK_RADII.round, height: 56, justifyContent: "center", marginTop: DAYMARK_SPACING.md },
    ctaText: { color: colors.white, fontFamily: DAYMARK_TYPE.body.fontFamily, fontSize: 16, fontWeight: "600", lineHeight: 22 },
  });
}
