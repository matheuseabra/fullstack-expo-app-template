import { useTodoStore } from "@/stores/todo-store";

export function useTodos() {
  const taskList = useTodoStore((state) => state.taskList);
  const isHydrated = useTodoStore((state) => state.isHydrated);
  const pendingOperations = useTodoStore((state) => state.pendingOperations);
  const loadError = useTodoStore((state) => state.loadError);
  const mutationError = useTodoStore((state) => state.mutationError);
  const sync = useTodoStore((state) => state.sync);
  const createTodo = useTodoStore((state) => state.createTodo);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  return {
    taskList,
    isLoading: !isHydrated,
    isError: Boolean(loadError) && taskList.length === 0,
    isPending: pendingOperations > 0,
    isMutationError: Boolean(mutationError),
    refetch: sync,
    createTodo,
    toggleTodo,
    deleteTodo,
  };
}
