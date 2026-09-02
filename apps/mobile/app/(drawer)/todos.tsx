import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Container } from "@/components/container";
import { DAYMARK_COLORS, DAYMARK_RADII, DAYMARK_SPACING, DAYMARK_TYPE } from "@/constants/daymark";
import { orpc } from "@/utils/orpc";

export default function TodosScreen() {
  const [newTodoText, setNewTodoText] = useState("");
  const todos = useQuery(orpc.todo.getAll.queryOptions());
  const createMutation = useMutation(orpc.todo.create.mutationOptions({
    onSuccess: () => { todos.refetch(); setNewTodoText(""); },
  }));
  const toggleMutation = useMutation(orpc.todo.toggle.mutationOptions({ onSuccess: () => todos.refetch() }));
  const deleteMutation = useMutation(orpc.todo.delete.mutationOptions({ onSuccess: () => todos.refetch() }));
  const taskList = todos.data ?? [];
  const completedCount = taskList.filter((todo) => todo.completed).length;

  const handleAddTodo = () => {
    if (newTodoText.trim()) createMutation.mutate({ text: newTodoText.trim() });
  };

  const handleDeleteTodo = (id: number) => {
    Alert.alert("Delete task", "Remove this task from your list?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteMutation.mutate({ id }) },
    ]);
  };

  return (
    <Container isScrollable={false} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.headingRow}>
          <View>
            <Text style={styles.pageTitle}>Tasks</Text>
            <Text style={styles.subtitle}>{completedCount} of {taskList.length} complete</Text>
          </View>
          <Ionicons name="list-outline" size={24} color={DAYMARK_COLORS.text} />
        </View>
        <View style={styles.addRow}>
          <TextInput
            value={newTodoText}
            onChangeText={setNewTodoText}
            onSubmitEditing={handleAddTodo}
            placeholder="Add a new task"
            placeholderTextColor={DAYMARK_COLORS.textSubtle}
            editable={!createMutation.isPending}
            returnKeyType="done"
            style={styles.input}
          />
          <Pressable style={[styles.addIconButton, !newTodoText.trim() && styles.addIconButtonDisabled]} disabled={!newTodoText.trim() || createMutation.isPending} onPress={handleAddTodo} accessibilityRole="button">
            <Ionicons name="add" size={22} color={newTodoText.trim() ? DAYMARK_COLORS.white : DAYMARK_COLORS.textSubtle} />
          </Pressable>
        </View>
        {todos.isLoading ? (
          <View style={styles.emptyState}><Text style={styles.subtitle}>Loading tasks…</Text></View>
        ) : taskList.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkbox-outline" size={40} color={DAYMARK_COLORS.textSubtle} />
            <Text style={styles.emptyTitle}>No tasks yet</Text>
            <Text style={styles.subtitle}>Add a task to get started.</Text>
          </View>
        ) : (
          <View style={styles.taskList}>
            {taskList.map((todo) => (
              <View key={todo.id} style={styles.taskRow}>
                <Pressable onPress={() => toggleMutation.mutate({ id: todo.id, completed: !todo.completed })} style={[styles.check, todo.completed && styles.checkDone]} accessibilityRole="checkbox" accessibilityState={{ checked: todo.completed }}>
                  {todo.completed ? <Ionicons name="checkmark" size={14} color={DAYMARK_COLORS.white} /> : null}
                </Pressable>
                <Text style={[styles.taskText, todo.completed && styles.taskTextDone]}>{todo.text}</Text>
                <Pressable onPress={() => handleDeleteTodo(todo.id)} style={styles.deleteButton} accessibilityRole="button" accessibilityLabel={`Delete ${todo.text}`}>
                  <Ionicons name="trash-outline" size={17} color={DAYMARK_COLORS.textMuted} />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: DAYMARK_COLORS.canvas },
  content: { padding: DAYMARK_SPACING.xl, paddingBottom: DAYMARK_SPACING.xxl },
  headingRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: DAYMARK_SPACING.xl },
  pageTitle: { ...DAYMARK_TYPE.pageTitle, color: DAYMARK_COLORS.text },
  subtitle: { ...DAYMARK_TYPE.small, color: DAYMARK_COLORS.textMuted, marginTop: DAYMARK_SPACING.xs },
  addRow: { alignItems: "center", backgroundColor: DAYMARK_COLORS.surface, borderColor: DAYMARK_COLORS.border, borderRadius: DAYMARK_RADII.surface, borderWidth: 1, flexDirection: "row", gap: DAYMARK_SPACING.sm, marginTop: DAYMARK_SPACING.xxl, padding: DAYMARK_SPACING.sm },
  input: { ...DAYMARK_TYPE.body, color: DAYMARK_COLORS.text, flex: 1, minHeight: 44, paddingHorizontal: DAYMARK_SPACING.sm },
  addIconButton: { alignItems: "center", backgroundColor: DAYMARK_COLORS.black, borderRadius: DAYMARK_RADII.control, height: 44, justifyContent: "center", width: 44 },
  addIconButtonDisabled: { backgroundColor: DAYMARK_COLORS.surfaceMuted },
  emptyState: { alignItems: "center", backgroundColor: DAYMARK_COLORS.surface, borderColor: DAYMARK_COLORS.border, borderRadius: DAYMARK_RADII.surface, borderWidth: 1, marginTop: DAYMARK_SPACING.lg, paddingHorizontal: DAYMARK_SPACING.xl, paddingVertical: 48 },
  emptyTitle: { ...DAYMARK_TYPE.sectionTitle, color: DAYMARK_COLORS.text, marginTop: DAYMARK_SPACING.md },
  taskList: { backgroundColor: DAYMARK_COLORS.surface, borderTopColor: DAYMARK_COLORS.border, borderTopWidth: 1, marginTop: DAYMARK_SPACING.xl },
  taskRow: { alignItems: "center", borderBottomColor: DAYMARK_COLORS.border, borderBottomWidth: 1, flexDirection: "row", gap: DAYMARK_SPACING.md, minHeight: 56 },
  check: { alignItems: "center", borderColor: DAYMARK_COLORS.borderStrong, borderRadius: DAYMARK_RADII.round, borderWidth: 1.5, height: 24, justifyContent: "center", width: 24 },
  checkDone: { backgroundColor: DAYMARK_COLORS.black, borderColor: DAYMARK_COLORS.black },
  taskText: { ...DAYMARK_TYPE.body, color: DAYMARK_COLORS.text, flex: 1 },
  taskTextDone: { color: DAYMARK_COLORS.textMuted, textDecorationLine: "line-through" },
  deleteButton: { alignItems: "center", height: 44, justifyContent: "center", width: 44 },
});
