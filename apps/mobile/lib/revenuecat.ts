import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { Platform } from "react-native";
import { REVENUECAT_APPLE_API_KEY, REVENUECAT_GOOGLE_API_KEY } from "@/constants/purchases";

let configured = false;

/**
 * Configures the RevenueCat SDK once with the platform-specific public key.
 * Must run on iOS/Android before any Purchases call; on web/Expo Go the SDK
 * runs in Preview API Mode and no native configuration is applied.
 */
export function configureRevenueCat() {
  if (configured) return;
  configured = true;

  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN);
  if (Platform.OS === "ios") {
    Purchases.configure({ apiKey: REVENUECAT_APPLE_API_KEY });
  } else if (Platform.OS === "android") {
    Purchases.configure({ apiKey: REVENUECAT_GOOGLE_API_KEY });
  }
}

export { Purchases };
