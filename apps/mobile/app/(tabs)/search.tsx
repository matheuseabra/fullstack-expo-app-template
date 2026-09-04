import { useState } from "react";
import { MagnifyingGlassIcon } from "phosphor-react-native";
import Animated, { FadeOut, LinearTransition } from "react-native-reanimated";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Container } from "@/components/container";
import { ScreenHeader } from "@/components/daymark-navigation";
import { DAYMARK_RADII, DAYMARK_SPACING, DAYMARK_TYPE, type DaymarkColors } from "@/constants/daymark";
import { useDaymarkColors } from "@/hooks/use-daymark-theme";
import { useTodos } from "@/hooks/use-todos";
import { hapticSuccess } from "@/utils/haptics";

type SearchTask = { id: number; text: string; completed: boolean };

function SearchTaskRow({ task, onComplete, disabled }: { task: SearchTask; onComplete: () => void; disabled: boolean }) {
  const colors = useDaymarkColors();
  const styles = makeStyles(colors);

  return (
    <Animated.View exiting={FadeOut.duration(180)} layout={LinearTransition.duration(180)}>
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: false }} disabled={disabled} onPress={() => { hapticSuccess(); onComplete(); }} style={styles.taskRow}>
        <View style={styles.taskCheck} />
        <Text style={styles.taskText}>{task.text}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const colors = useDaymarkColors();
  const styles = makeStyles(colors);
  const { taskList, isLoading, isError, refetch, isPending, toggleTodo } = useTodos();
  const normalizedQuery = query.trim().toLowerCase();
  const results = taskList.filter((task) => !task.completed && (!normalizedQuery || task.text.toLowerCase().includes(normalizedQuery)));

  return (
    <Container isScrollable={false} style={styles.container}>
      <ScreenHeader title="Search" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.heading}>
          <Text style={styles.pageTitle}>Search</Text>
          <Text style={styles.subtitle}>Find an open task.</Text>
        </View>
        <View style={styles.searchField}>
          <MagnifyingGlassIcon color={colors.textMuted} size={21} weight="bold" />
          <TextInput autoCapitalize="none" autoCorrect={false} onChangeText={setQuery} placeholder="Search tasks" placeholderTextColor={colors.textSubtle} style={styles.input} value={query} />
        </View>
        <View style={styles.results}>
          {isLoading ? (
            <Text style={styles.statusText}>Loading tasks…</Text>
          ) : isError ? (
            <View style={styles.emptyState}><Text style={styles.emptyTitle}>Couldn’t load tasks</Text><Pressable onPress={() => refetch()} accessibilityRole="button"><Text style={styles.retryText}>Try again</Text></Pressable></View>
          ) : results.length === 0 ? (
            <View style={styles.emptyState}>
              <MagnifyingGlassIcon color={colors.textSubtle} size={30} weight="regular" />
              <Text style={styles.emptyTitle}>{normalizedQuery ? "No matching tasks" : "No open tasks"}</Text>
              <Text style={styles.subtitle}>{normalizedQuery ? "Try another search." : "Completed tasks stay out of the way."}</Text>
            </View>
          ) : (
            results.map((task) => <SearchTaskRow key={task.id} disabled={isPending} onComplete={() => { void toggleTodo(task.id, true).catch(() => undefined); }} task={task} />)
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
    searchField: { alignItems: "center", backgroundColor: colors.surfaceMuted, borderRadius: DAYMARK_RADII.round, flexDirection: "row", gap: DAYMARK_SPACING.sm, minHeight: 52, paddingHorizontal: DAYMARK_SPACING.lg },
    input: { ...DAYMARK_TYPE.body, color: colors.text, flex: 1, minHeight: 44 },
    results: { marginTop: DAYMARK_SPACING.xl },
    taskRow: { alignItems: "center", flexDirection: "row", gap: DAYMARK_SPACING.md, minHeight: 54 },
    taskCheck: { borderColor: colors.borderStrong, borderRadius: DAYMARK_RADII.round, borderWidth: 2, height: 28, width: 28 },
    taskText: { ...DAYMARK_TYPE.body, color: colors.text, flex: 1 },
    statusText: { ...DAYMARK_TYPE.small, color: colors.textMuted, textAlign: "center" },
    emptyState: { alignItems: "center", paddingVertical: DAYMARK_SPACING.xl },
    emptyTitle: { ...DAYMARK_TYPE.sectionTitle, color: colors.text, marginTop: DAYMARK_SPACING.sm },
    retryText: { ...DAYMARK_TYPE.label, color: colors.text, marginTop: DAYMARK_SPACING.sm },
  });
}
