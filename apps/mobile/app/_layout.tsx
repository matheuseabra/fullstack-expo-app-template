
import "@/global.css";

import { QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";

import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AppState } from "react-native";
import { AppThemeProvider } from "@/contexts/app-theme-context";
import { useDaymarkColors } from "@/hooks/use-daymark-theme";
import { registerBackgroundSync } from "@/lib/background-sync";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { useTodoStore } from "@/stores/todo-store";

import { queryClient } from "@/utils/orpc";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};



function StackLayout() {
  const colors = useDaymarkColors();

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.canvas } }}>
      <Stack.Screen name="(tabs)" options={{ animation: "fade", headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ animation: "fade", headerShown: false }} />
      <Stack.Screen name="modal" options={{ title: "Settings", presentation: "modal" }} />
    </Stack>
  );
}

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

function OnboardingGate() {
  const pathname = usePathname();
  const router = useRouter();
  const isReady = useOnboardingStore((state) => state.isReady);
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const load = useOnboardingStore((state) => state.load);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!isReady) return;
    const isOnboarding = pathname.includes("onboarding");
    if (!hasCompletedOnboarding && !isOnboarding) router.replace("/onboarding");
    if (hasCompletedOnboarding && isOnboarding) router.replace("/(tabs)");
    void SplashScreen.hideAsync();
  }, [hasCompletedOnboarding, isReady, pathname, router]);

  return null;
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
      <OnboardingGate />
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
