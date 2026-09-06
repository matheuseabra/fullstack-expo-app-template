import { env } from "@fullstack-expo-app-template/env/native";

/**
 * Entitlement that grants Daymark Plus access. Must match the entitlement
 * identifier configured in the RevenueCat dashboard.
 */
export const DAYMARK_PLUS_ENTITLEMENT_ID = "daymark_plus";

// RevenueCat public SDK keys (safe to embed in the client; see docs).
export const REVENUECAT_APPLE_API_KEY = env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY;
export const REVENUECAT_GOOGLE_API_KEY = env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY;
