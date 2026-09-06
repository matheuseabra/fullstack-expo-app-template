import { CheckCircleIcon, XIcon } from "phosphor-react-native";
import { useRouter } from "expo-router";
import { useColorScheme, Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Container } from "@/components/container";
import { DAYMARK_RADII, DAYMARK_SPACING, DAYMARK_TYPE, type DaymarkColors } from "@/constants/daymark";
import { useDaymarkColors } from "@/hooks/use-daymark-theme";
import { type PaywallPurchaseState, usePaywallPurchases } from "@/hooks/use-paywall-purchases";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { hapticLight } from "@/utils/haptics";

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
  const purchase = usePaywallPurchases(close);

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
          <PaywallOfferCard purchase={purchase} styles={styles} />
          <PaywallPurchaseActions purchase={purchase} styles={styles} />
        </View>
      </View>
    </Container>
  );
}

type PaywallStyles = ReturnType<typeof makeStyles>;

function storeName() {
  return Platform.OS === "ios" ? "App Store" : Platform.OS === "android" ? "Google Play" : "store";
}

function PaywallOfferCard({ purchase, styles }: { purchase: PaywallPurchaseState; styles: PaywallStyles }) {
  const price = purchase.subscription?.displayPrice ?? (purchase.connected ? "Unavailable" : "Loading…");
  const store = storeName();
  const details = purchase.subscription
    ? `${purchase.subscription.displayPrice} through the ${store}. Manage or cancel anytime in your store account settings.`
    : purchase.connected
      ? `Connect to the ${store} to load the current plan and price.`
      : "Connecting to the store to load the current plan and price…";

  return (
    <View style={styles.offerCard}>
      <View style={styles.offerHeader}>
        <Text style={styles.offerLabel}>More clarity, when you need it.</Text>
        <Text style={styles.offerBadge}>{price}</Text>
      </View>
      <Text style={styles.offerBody}>{details}</Text>
    </View>
  );
}

function PaywallPurchaseActions({ purchase, styles }: { purchase: PaywallPurchaseState; styles: PaywallStyles }) {
  const disabled = purchase.isPurchasing || purchase.isRestoring;
  const buttonText = purchase.hasActiveSubscription
    ? "Continue to Daymark"
    : purchase.isPurchasing
      ? "Waiting for the store…"
      : purchase.hasFreeTrial
        ? "Start my free trial"
        : "Start Daymark Plus";

  return (
    <>
      <Pressable accessibilityRole="button" accessibilityLabel={purchase.hasActiveSubscription ? "Continue to Daymark" : "Purchase Daymark Plus"} disabled={disabled} onPress={() => void purchase.handlePurchase()} style={[styles.ctaButton, disabled && styles.ctaButtonDisabled]}>
        <Text style={styles.ctaText}>{buttonText}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Restore Daymark Plus purchase" disabled={disabled} onPress={() => void purchase.handleRestore()} style={styles.restoreButton}>
        <Text style={styles.restoreText}>{purchase.isRestoring ? "Restoring…" : "Restore purchase"}</Text>
      </Pressable>
      {purchase.purchaseError ? <Text accessibilityRole="alert" style={styles.errorText}>{purchase.purchaseError}</Text> : null}
    </>
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
    ctaButtonDisabled: { opacity: 0.55 },
    ctaText: { color: colors.white, fontFamily: DAYMARK_TYPE.body.fontFamily, fontSize: 16, fontWeight: "600", lineHeight: 22 },
    restoreButton: { alignItems: "center", height: 40, justifyContent: "center", marginTop: DAYMARK_SPACING.xs },
    restoreText: { ...DAYMARK_TYPE.small, color: colors.textMuted },
    errorText: { ...DAYMARK_TYPE.small, color: colors.danger, marginTop: DAYMARK_SPACING.sm, textAlign: "center" },
  });
}
