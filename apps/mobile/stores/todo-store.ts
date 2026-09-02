import { create } from "zustand";
import {
  createLocalTodo,
  deleteLocalTodo,
  initializeLocalDb,
  listLocalTodos,
  syncLocalTodos,
  toggleLocalTodo,
  type Todo,
} from "@/lib/local-db";

type TodoStore = {
  taskList: Todo[];
  isHydrated: boolean;
  isSyncing: boolean;
  pendingOperations: number;
  loadError: string | null;
  mutationError: string | null;
  syncError: string | null;
  hydrate: () => Promise<void>;
  sync: () => Promise<void>;
  createTodo: (text: string) => Promise<void>;
  toggleTodo: (id: number, completed: boolean) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

async function refresh(set: (value: Partial<TodoStore>) => void) {
  set({ taskList: await listLocalTodos() });
}

async function runMutation(
  set: (value: Partial<TodoStore>) => void,
  get: () => TodoStore,
  mutation: () => Promise<void>,
) {
  set({ pendingOperations: get().pendingOperations + 1, mutationError: null });
  try {
    await mutation();
    await refresh(set);
    void get().sync();
  } catch (error) {
    set({ mutationError: errorMessage(error) });
    throw error;
  } finally {
    set({ pendingOperations: Math.max(0, get().pendingOperations - 1) });
  }
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  taskList: [],
  isHydrated: false,
  isSyncing: false,
  pendingOperations: 0,
  loadError: null,
  mutationError: null,
  syncError: null,
  hydrate: async () => {
    if (get().isHydrated) return;
    try {
      await initializeLocalDb();
      await refresh(set);
      set({ isHydrated: true, loadError: null });
    } catch (error) {
      set({ isHydrated: true, loadError: errorMessage(error) });
    }
  },
  sync: async () => {
    if (get().isSyncing) return;
    set({ isSyncing: true, syncError: null });
    try {
      await syncLocalTodos();
      await refresh(set);
    } catch (error) {
      set({ syncError: errorMessage(error) });
    } finally {
      set({ isSyncing: false });
    }
  },
  createTodo: (text) => runMutation(set, get, () => createLocalTodo(text)),
  toggleTodo: (id, completed) => runMutation(set, get, () => toggleLocalTodo(id, completed)),
  deleteTodo: (id) => runMutation(set, get, () => deleteLocalTodo(id)),
}));
