import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

const ONBOARDING_KEY = "daymark.onboarding.completed";

type OnboardingState = {
  hasCompletedOnboarding: boolean;
  isReady: boolean;
  load: () => Promise<void>;
  complete: () => Promise<void>;
  reset: () => Promise<void>;
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  hasCompletedOnboarding: false,
  isReady: false,
  load: async () => {
    if (get().isReady) return;
    const value = await SecureStore.getItemAsync(ONBOARDING_KEY);
    set({ hasCompletedOnboarding: value === "true", isReady: true });
  },
  complete: async () => {
    await SecureStore.setItemAsync(ONBOARDING_KEY, "true");
    set({ hasCompletedOnboarding: true, isReady: true });
  },
  reset: async () => {
    await SecureStore.deleteItemAsync(ONBOARDING_KEY);
    set({ hasCompletedOnboarding: false, isReady: true });
  },
}));
