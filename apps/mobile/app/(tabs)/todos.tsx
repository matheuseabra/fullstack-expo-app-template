import { useEffect, useRef, useState } from "react";
import { ArrowUpIcon, CheckIcon, CheckSquareIcon, PlusIcon, TrashIcon } from "phosphor-react-native";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Container } from "@/components/container";
import { ScreenHeader } from "@/components/daymark-navigation";
import { DAYMARK_RADII, DAYMARK_SPACING, DAYMARK_TYPE, type DaymarkColors } from "@/constants/daymark";
import { useDaymarkColors } from "@/hooks/use-daymark-theme";
import { useTodos } from "@/hooks/use-todos";
import { hapticSelection, hapticSuccess, hapticWarning } from "@/utils/haptics";

export default function TodosScreen() {
  const [newTodoText, setNewTodoText] = useState("");
  const colors = useDaymarkColors();
  const styles = makeStyles(colors);
  const inputRef = useRef<TextInput>(null);
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const { taskList, isLoading, isError, refetch, isPending, isMutationError, createTodo, toggleTodo, deleteTodo } = useTodos();
  const completedCount = taskList.filter((todo) => todo.completed).length;

  useEffect(() => {
    if (focus === "1") inputRef.current?.focus();
  }, [focus]);

  const handleAddTodo = () => {
    const text = newTodoText.trim();
    if (!text || isPending) return;
    void createTodo(text).then(() => {
      hapticSuccess();
      setNewTodoText("");
    }).catch(() => undefined);
  };

  const handleDeleteTodo = (id: number) => {
    Alert.alert("Delete task", "Remove this task from your list?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => { hapticWarning(); void deleteTodo(id).catch(() => undefined); } },
    ]);
  };

  return (
    <Container isScrollable={false} style={styles.container}>
      <ScreenHeader title="Inbox" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.heading}>
          <Text style={styles.pageTitle}>Inbox</Text>
          <Text style={styles.subtitle}>Keep the open loops close.</Text>
        </View>
        <View style={styles.addRow}>
          <PlusIcon size={21} weight="regular" color={colors.textMuted} />
          <TextInput
            ref={inputRef}
            value={newTodoText}
            onChangeText={setNewTodoText}
            onSubmitEditing={handleAddTodo}
            placeholder="Add a new task"
            placeholderTextColor={colors.textSubtle}
            editable={!isPending}
            returnKeyType="done"
            style={styles.input}
          />
          <Pressable style={[styles.addIconButton, (!newTodoText.trim() || isPending) && styles.addIconButtonDisabled]} disabled={!newTodoText.trim() || isPending} onPress={handleAddTodo} accessibilityRole="button" accessibilityLabel="Save task">
            <ArrowUpIcon size={20} weight="bold" color={newTodoText.trim() ? colors.white : colors.textSubtle} />
          </Pressable>
        </View>
        <View style={styles.listCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>All tasks</Text>
            <Text style={styles.cardMeta}>{completedCount} of {taskList.length} done</Text>
          </View>
          {isLoading ? (
            <View style={styles.emptyState}><Text style={styles.subtitle}>Loading tasks…</Text></View>
          ) : isError ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Couldn’t load tasks</Text>
              <Pressable onPress={() => refetch()} accessibilityRole="button"><Text style={styles.retryText}>Try again</Text></Pressable>
            </View>
          ) : taskList.length === 0 ? (
            <View style={styles.emptyState}>
              <CheckSquareIcon size={30} weight="regular" color={colors.textSubtle} />
              <Text style={styles.emptyTitle}>No tasks yet</Text>
              <Text style={styles.subtitle}>Add a task to get started.</Text>
            </View>
          ) : (
            <View style={styles.taskList}>
              {taskList.map((todo) => (
                <View key={todo.id} style={styles.taskRow}>
                  <Pressable onPress={() => { todo.completed ? hapticSelection() : hapticSuccess(); void toggleTodo(todo.id, !todo.completed).catch(() => undefined); }} style={[styles.check, todo.completed && styles.checkDone]} accessibilityRole="checkbox" accessibilityState={{ checked: todo.completed }}>
                    {todo.completed ? <CheckIcon size={13} weight="bold" color={colors.white} /> : null}
                  </Pressable>
                  <Text style={[styles.taskText, todo.completed && styles.taskTextDone]}>{todo.text}</Text>
                  <Pressable onPress={() => handleDeleteTodo(todo.id)} style={styles.deleteButton} accessibilityRole="button" accessibilityLabel={`Delete ${todo.text}`}>
                    <TrashIcon size={19} weight="regular" color={colors.textMuted} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
          {isMutationError ? <Text style={styles.errorText}>Couldn’t save that task. Try again.</Text> : null}
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
  addRow: { alignItems: "center", backgroundColor: colors.surfaceMuted, borderRadius: DAYMARK_RADII.surface, flexDirection: "row", gap: DAYMARK_SPACING.sm, minHeight: 52, padding: DAYMARK_SPACING.sm },
  input: { ...DAYMARK_TYPE.body, color: colors.text, flex: 1, minHeight: 36, paddingHorizontal: DAYMARK_SPACING.xs },
  addIconButton: { alignItems: "center", backgroundColor: colors.black, borderRadius: DAYMARK_RADII.round, height: 36, justifyContent: "center", width: 36 },
  addIconButtonDisabled: { backgroundColor: colors.surfaceMuted },
  listCard: { marginTop: DAYMARK_SPACING.xl },
  cardHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: DAYMARK_SPACING.sm },
  cardTitle: { ...DAYMARK_TYPE.label, color: colors.text },
  cardMeta: { ...DAYMARK_TYPE.small, color: colors.textMuted },
  taskList: { gap: DAYMARK_SPACING.sm },
  taskRow: { alignItems: "center", flexDirection: "row", gap: DAYMARK_SPACING.md, minHeight: 52 },
  check: { alignItems: "center", borderColor: colors.borderStrong, borderRadius: DAYMARK_RADII.round, borderWidth: 2, height: 30, justifyContent: "center", width: 30 },
  checkDone: { backgroundColor: colors.black, borderColor: colors.black },
  taskText: { ...DAYMARK_TYPE.body, color: colors.text, flex: 1 },
  taskTextDone: { color: colors.textMuted },
  deleteButton: { alignItems: "center", height: 42, justifyContent: "center", width: 42 },
  emptyState: { alignItems: "center", paddingVertical: DAYMARK_SPACING.lg },
  emptyTitle: { ...DAYMARK_TYPE.sectionTitle, color: colors.text, marginTop: DAYMARK_SPACING.sm },
  retryText: { ...DAYMARK_TYPE.label, color: colors.text, marginTop: DAYMARK_SPACING.sm },
  errorText: { ...DAYMARK_TYPE.small, color: colors.danger, marginTop: DAYMARK_SPACING.sm, textAlign: "center" },
  });
}
