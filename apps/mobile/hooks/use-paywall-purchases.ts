import { PURCHASES_ERROR_CODE } from "react-native-purchases";
import type { CustomerInfo, PurchasesPackage, PurchasesStoreProduct } from "react-native-purchases";
import { Alert, Platform } from "react-native";
import { useEffect, useState } from "react";
import { DAYMARK_PLUS_ENTITLEMENT_ID } from "@/constants/purchases";
import { Purchases, configureRevenueCat } from "@/lib/revenuecat";
import { hapticLight, hapticMedium, hapticSuccess, hapticWarning } from "@/utils/haptics";

export type PaywallPurchaseState = {
  connected: boolean;
  subscription?: {
    displayPrice: string;
    productIdentifier: string;
  };
  hasActiveSubscription: boolean;
  hasFreeTrial: boolean;
  isPurchasing: boolean;
  isRestoring: boolean;
  purchaseError: string | null;
  handlePurchase: () => Promise<void>;
  handleRestore: () => Promise<void>;
};

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function isCancellation(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code?: unknown }).code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR
  ) {
    return true;
  }
  const message = error instanceof Error ? error.message : String(error);
  return /cancel|dismiss|closed/i.test(message);
}

function entitlementIsActive(customerInfo: CustomerInfo) {
  return customerInfo.entitlements.active[DAYMARK_PLUS_ENTITLEMENT_ID] !== undefined;
}

function hasFreeTrialFor(product: PurchasesStoreProduct | null | undefined) {
  return product?.introPrice !== null && product?.introPrice !== undefined;
}

function displayPrice(product: PurchasesStoreProduct) {
  const period = product.subscriptionPeriod;
  const price = product.priceString;
  if (!period) return price;
  const match = /^P(?:(\d+)D|(\d+)W|(\d+)M|(\d+)Y)$/.exec(period);
  if (!match) return price;
  const [, days, weeks, months, years] = match;
  if (months === "1") return `${price}/month`;
  if (years === "1") return `${price}/year`;
  if (months) return `${price}/${months} months`;
  if (weeks === "1") return `${price}/week`;
  if (weeks) return `${price}/${weeks} weeks`;
  if (days) return `${price}/${days} days`;
  return price;
}

export function usePaywallPurchases(onPurchaseComplete: () => void): PaywallPurchaseState {
  const [connected, setConnected] = useState(false);
  const [monthlyPackage, setMonthlyPackage] = useState<PurchasesPackage | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [hasFreeTrial, setHasFreeTrial] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== "ios" && Platform.OS !== "android") return;
    let cancelled = false;

    async function setup() {
      try {
        configureRevenueCat();
        const [offerings, customerInfo] = await Promise.all([Purchases.getOfferings(), Purchases.getCustomerInfo()]);
        if (cancelled) return;

        const pkg = offerings.current?.monthly ?? offerings.current?.availablePackages[0] ?? null;
        setMonthlyPackage(pkg);
        setHasFreeTrial(hasFreeTrialFor(pkg?.product));
        setHasActiveSubscription(entitlementIsActive(customerInfo));
        setConnected(true);
      } catch (error: unknown) {
        if (cancelled) return;
        setConnected(false);
        setPurchaseError(errorMessage(error, "We couldn't connect to the store. Please try again."));
        hapticWarning();
      }
    }

    void setup();

    const listener = (customerInfo: CustomerInfo) => {
      setHasActiveSubscription(entitlementIsActive(customerInfo));
    };
    Purchases.addCustomerInfoUpdateListener(listener);

    return () => {
      cancelled = true;
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, []);

  const subscription = monthlyPackage
    ? {
        displayPrice: displayPrice(monthlyPackage.product),
        productIdentifier: monthlyPackage.product.identifier,
      }
    : undefined;

  const handlePurchase = async () => {
    hapticMedium();
    if (hasActiveSubscription) {
      onPurchaseComplete();
      return;
    }
    if (!monthlyPackage) {
      setPurchaseError("Daymark Plus is unavailable until an offering is configured in RevenueCat.");
      return;
    }
    if (!connected) {
      setPurchaseError("The store is not ready yet. Please try again in a moment.");
      return;
    }

    setPurchaseError(null);
    setIsPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(monthlyPackage);
      if (entitlementIsActive(customerInfo)) {
        hapticSuccess();
        Alert.alert("Daymark Plus is active", "Your subscription is ready. Enjoy a clearer day.", [
          { text: "Continue to Daymark", onPress: onPurchaseComplete },
        ]);
      }
    } catch (error: unknown) {
      if (isCancellation(error)) return;
      setPurchaseError(errorMessage(error, "We couldn't start the purchase. Please try again."));
      hapticWarning();
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    hapticLight();
    setPurchaseError(null);
    setIsRestoring(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      if (entitlementIsActive(customerInfo)) {
        hapticSuccess();
        Alert.alert("Daymark Plus restored", "Your subscription is active on this device.", [
          { text: "Continue to Daymark", onPress: onPurchaseComplete },
        ]);
      } else {
        setPurchaseError("No active Daymark Plus subscription was found.");
      }
    } catch (error: unknown) {
      if (isCancellation(error)) return;
      setPurchaseError(errorMessage(error, "We couldn't restore your purchase. Please try again."));
      hapticWarning();
    } finally {
      setIsRestoring(false);
    }
  };

  return {
    connected,
    subscription,
    hasActiveSubscription,
    hasFreeTrial,
    isPurchasing,
    isRestoring,
    purchaseError,
    handlePurchase,
    handleRestore,
  };
}
