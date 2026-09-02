
import "@/global.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AppState } from "react-native";
import { AppThemeProvider } from "@/contexts/app-theme-context";
import { DAYMARK_COLORS } from "@/constants/daymark";
import { registerBackgroundSync } from "@/lib/background-sync";
import { useTodoStore } from "@/stores/todo-store";

import { queryClient } from "@/utils/orpc";

export const unstable_settings = {
  initialRouteName: "(drawer)",
};



function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: DAYMARK_COLORS.canvas } }}>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ title: "Settings", presentation: "modal" }} />
    </Stack>
  );
}

function OfflineSyncBootstrap() {
  const hydrate = useTodoStore((state) => state.hydrate);
  const sync = useTodoStore((state) => state.sync);

  useEffect(() => {
    void hydrate().then(() => {
      void sync();
      void registerBackgroundSync().catch((error: unknown) => console.warn("Could not register background sync", error));
    });
    const interval = setInterval(() => void sync(), 60_000);
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void sync();
    });
    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [hydrate, sync]);

  return null;
}

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <OfflineSyncBootstrap />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <AppThemeProvider>
            <HeroUINativeProvider>
              <StackLayout />
            </HeroUINativeProvider>
          </AppThemeProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
