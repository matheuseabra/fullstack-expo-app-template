import { useTodoStore } from "@/stores/todo-store";

export function useTodos() {
  const taskList = useTodoStore((state) => state.taskList);
  const isHydrated = useTodoStore((state) => state.isHydrated);
  const pendingOperations = useTodoStore((state) => state.pendingOperations);
  const loadError = useTodoStore((state) => state.loadError);
  const mutationError = useTodoStore((state) => state.mutationError);
  const hydrate = useTodoStore((state) => state.hydrate);
  const sync = useTodoStore((state) => state.sync);
  const createTodo = useTodoStore((state) => state.createTodo);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const mutation = <T,>(action: (value: T) => Promise<void>) => ({
    isPending: pendingOperations > 0,
    isError: Boolean(mutationError),
    mutate: (value: T, options?: { onSuccess?: () => void; onError?: (error: unknown) => void }) => {
      void action(value).then(() => options?.onSuccess?.()).catch((error: unknown) => options?.onError?.(error));
    },
  });

  return {
    taskList,
    isLoading: !isHydrated,
    isError: Boolean(loadError) && taskList.length === 0,
    refetch: sync,
    create: mutation<{ text: string }>(({ text }) => createTodo(text)),
    toggle: mutation<{ id: number; completed: boolean }>(({ id, completed }) => toggleTodo(id, completed)),
    remove: mutation<{ id: number }>(({ id }) => deleteTodo(id)),
    hydrate,
  };
}
