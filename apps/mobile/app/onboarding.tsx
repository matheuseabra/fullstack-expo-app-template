import { useState } from "react";
import { CaretLeftIcon } from "phosphor-react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Container } from "@/components/container";
import { DAYMARK_RADII, DAYMARK_SPACING, DAYMARK_TYPE, type DaymarkColors } from "@/constants/daymark";
import { useDaymarkColors } from "@/hooks/use-daymark-theme";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { hapticSelection, hapticSuccess } from "@/utils/haptics";

const icon = require("../assets/images/icon.png");
const darkIcon = require("../assets/images/icon-dark.png");

const steps = [
  { title: "A clear place for today.", body: "Daymark keeps the tasks that matter close, calm, and easy to finish." },
  { title: "Capture the open loops.", body: "Add a task whenever it arrives. Your list stays ready wherever you are." },
  { title: "See your week at a glance.", body: "Make steady progress without turning your day into a dashboard." },
];

export default function OnboardingScreen() {
  const [stepIndex, setStepIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const colors = useDaymarkColors();
  const styles = makeStyles(colors);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const complete = useOnboardingStore((state) => state.complete);
  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  const handleContinue = () => {
    if (!isLastStep) {
      hapticSelection();
      setStepIndex((current) => current + 1);
      return;
    }
    void complete().then(() => {
      hapticSuccess();
      router.replace("/(tabs)");
    });
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      hapticSelection();
      setStepIndex((current) => current - 1);
    }
  };

  return (
    <Container isScrollable={false} style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + DAYMARK_SPACING.xxl }]}>
        <View style={styles.topBar}>
          {stepIndex > 0 ? (
            <Pressable onPress={handleBack} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Previous onboarding step">
              <CaretLeftIcon size={24} weight="bold" color={colors.text} />
            </Pressable>
          ) : null}
        </View>
        <Animated.View key={step.title} entering={FadeIn.duration(220)} exiting={FadeOut.duration(140)} style={styles.copy}>
          {stepIndex === 0 ? <Image source={colorScheme === "dark" ? darkIcon : icon} style={styles.icon} /> : null}
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.body}>{step.body}</Text>
        </Animated.View>
        <View style={styles.progress} accessibilityLabel={`Onboarding step ${stepIndex + 1} of ${steps.length}`}>
          {steps.map((item, index) => <View key={item.title} style={[styles.progressDot, index === stepIndex && styles.progressDotActive]} />)}
        </View>
        <View style={styles.footer}>
          <Pressable onPress={handleContinue} style={styles.button} accessibilityRole="button" accessibilityLabel={isLastStep ? "Get started with Daymark" : "Continue onboarding"}>
            <Text style={styles.buttonText}>{isLastStep ? "Get started" : "Continue"}</Text>
          </Pressable>
        </View>
      </View>
    </Container>
  );
}

function makeStyles(colors: DaymarkColors) {
  return StyleSheet.create({
  container: { backgroundColor: colors.canvas },
  content: { flex: 1, paddingHorizontal: DAYMARK_SPACING.xl, paddingBottom: DAYMARK_SPACING.xxl },
  topBar: { height: 44, justifyContent: "flex-start" },
  copy: { alignItems: "center", flex: 1, justifyContent: "center", maxWidth: 330, width: "100%" },
  icon: { height: 64, marginBottom: DAYMARK_SPACING.xl, width: 64 },
  title: { ...DAYMARK_TYPE.pageTitle, color: colors.text, fontSize: 34, lineHeight: 40, textAlign: "center" },
  body: { ...DAYMARK_TYPE.body, color: colors.textMuted, marginTop: DAYMARK_SPACING.md, textAlign: "center" },
  progress: { alignSelf: "center", flexDirection: "row", gap: DAYMARK_SPACING.sm, marginBottom: DAYMARK_SPACING.lg },
  progressDot: { backgroundColor: colors.borderStrong, borderRadius: DAYMARK_RADII.round, height: 6, width: 6 },
  progressDotActive: { backgroundColor: colors.black, width: 24 },
  footer: { width: "100%" },
  backButton: { alignItems: "center", backgroundColor: colors.surface, borderRadius: DAYMARK_RADII.round, elevation: 2, height: 44, justifyContent: "center", shadowColor: colors.black, shadowOffset: { height: 4, width: 0 }, shadowOpacity: 0.07, shadowRadius: 12, width: 44 },
  button: { alignItems: "center", backgroundColor: colors.black, borderRadius: DAYMARK_RADII.round, height: 56, justifyContent: "center", width: "100%" },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "600", lineHeight: 20 },
  });
}
