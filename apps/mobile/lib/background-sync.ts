import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";
import { syncLocalTodos } from "@/lib/local-db";

const TASK_NAME = "daymark-background-sync";

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    await syncLocalTodos();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.warn("Daymark background sync failed", error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerBackgroundSync() {
  if (Platform.OS === "web") return;
  const status = await BackgroundTask.getStatusAsync();
  if (status !== BackgroundTask.BackgroundTaskStatus.Available) return;
  const registered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
  if (!registered) await BackgroundTask.registerTaskAsync(TASK_NAME, { minimumInterval: 15 });
}
