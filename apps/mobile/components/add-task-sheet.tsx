import { useEffect, useRef, useState } from "react";
import { CheckIcon, XIcon } from "phosphor-react-native";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DAYMARK_RADII, DAYMARK_SPACING, DAYMARK_TYPE, type DaymarkColors } from "@/constants/daymark";
import { useDaymarkColors } from "@/hooks/use-daymark-theme";
import { useTodos } from "@/hooks/use-todos";
import { useAddTaskSheetStore } from "@/stores/add-task-sheet-store";
import { hapticLight, hapticSuccess } from "@/utils/haptics";

export function AddTaskSheet() {
  const [text, setText] = useState("");
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const colors = useDaymarkColors();
  const styles = makeStyles(colors);
  const isOpen = useAddTaskSheetStore((state) => state.isOpen);
  const close = useAddTaskSheetStore((state) => state.close);
  const { createTodo, isPending, isMutationError } = useTodos();

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 180);
  }, [isOpen]);

  const dismiss = () => {
    hapticLight();
    setText("");
    close();
  };

  const submit = () => {
    const value = text.trim();
    if (!value || isPending) return;
    void createTodo(value).then(() => {
      hapticSuccess();
      setText("");
      close();
    }).catch(() => undefined);
  };

  return (
    <Modal animationType="slide" onRequestClose={dismiss} transparent visible={isOpen}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modal}>
        <Pressable accessibilityRole="button" accessibilityLabel="Dismiss add task" onPress={dismiss} style={styles.backdrop} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + DAYMARK_SPACING.lg }]}>
          <View style={styles.grabber} />
          <View style={styles.header}>
            <Text style={styles.title}>Add task</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Close add task" onPress={dismiss} style={styles.closeButton}>
              <XIcon color={colors.textMuted} size={20} weight="bold" />
            </Pressable>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              autoCapitalize="sentences"
              autoCorrect
              onChangeText={setText}
              onSubmitEditing={submit}
              placeholder="What needs doing?"
              placeholderTextColor={colors.textSubtle}
              ref={inputRef}
              returnKeyType="done"
              style={styles.input}
              value={text}
            />
            <Pressable accessibilityRole="button" accessibilityLabel="Save task" disabled={!text.trim() || isPending} onPress={submit} style={[styles.submitButton, (!text.trim() || isPending) && styles.submitButtonDisabled]}>
              <CheckIcon color={text.trim() && !isPending ? colors.white : colors.textSubtle} size={21} weight="bold" />
            </Pressable>
          </View>
          {isMutationError ? <Text style={styles.errorText}>Couldn’t save that task. Try again.</Text> : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function makeStyles(colors: DaymarkColors) {
  return StyleSheet.create({
    modal: { flex: 1, justifyContent: "flex-end" },
    backdrop: { backgroundColor: "rgba(0, 0, 0, 0.16)", bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
    sheet: { backgroundColor: colors.surface, borderTopLeftRadius: DAYMARK_RADII.surface, borderTopRightRadius: DAYMARK_RADII.surface, elevation: 8, paddingHorizontal: DAYMARK_SPACING.xl, paddingTop: DAYMARK_SPACING.sm, shadowColor: colors.black, shadowOffset: { height: -4, width: 0 }, shadowOpacity: 0.1, shadowRadius: 18 },
    grabber: { alignSelf: "center", backgroundColor: colors.border, borderRadius: DAYMARK_RADII.round, height: 4, marginBottom: DAYMARK_SPACING.lg, width: 36 },
    header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: DAYMARK_SPACING.md },
    title: { ...DAYMARK_TYPE.sectionTitle, color: colors.text },
    closeButton: { alignItems: "center", height: 36, justifyContent: "center", width: 36 },
    inputRow: { alignItems: "center", backgroundColor: colors.surfaceMuted, borderRadius: DAYMARK_RADII.round, flexDirection: "row", minHeight: 52, paddingLeft: DAYMARK_SPACING.lg, paddingRight: DAYMARK_SPACING.sm },
    input: { ...DAYMARK_TYPE.body, color: colors.text, flex: 1, minHeight: 44, paddingVertical: DAYMARK_SPACING.sm },
    submitButton: { alignItems: "center", backgroundColor: colors.black, borderRadius: DAYMARK_RADII.round, height: 36, justifyContent: "center", width: 36 },
    submitButtonDisabled: { backgroundColor: colors.surfaceMuted },
    errorText: { ...DAYMARK_TYPE.small, color: colors.danger, marginTop: DAYMARK_SPACING.sm, textAlign: "center" },
  });
}
