import {
  finishTransaction as finishIapTransaction,
  type MutationRequestPurchaseArgs,
  type ProductSubscription,
  type Purchase,
  useIAP,
} from "expo-iap";
import { Platform, Alert } from "react-native";
import { useEffect, useState } from "react";
import { DAYMARK_PLUS_PRODUCT_ID } from "@/constants/purchases";
import { hapticLight, hapticMedium, hapticSuccess, hapticWarning } from "@/utils/haptics";

export type PaywallPurchaseState = {
  connected: boolean;
  subscription?: ProductSubscription;
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

function isCancellation(message: string) {
  return /cancel|dismiss|closed/i.test(message);
}

function purchaseRequest(subscription: ProductSubscription): MutationRequestPurchaseArgs | null {
  if (Platform.OS === "ios") {
    return { type: "subs", request: { apple: { sku: DAYMARK_PLUS_PRODUCT_ID } } };
  }
  if (Platform.OS !== "android") return null;

  const offerToken = subscription.subscriptionOffers?.find((offer) => offer.offerTokenAndroid)?.offerTokenAndroid;
  return {
    type: "subs",
    request: {
      google: {
        skus: [DAYMARK_PLUS_PRODUCT_ID],
        subscriptionOffers: offerToken ? [{ sku: DAYMARK_PLUS_PRODUCT_ID, offerToken }] : null,
      },
    },
  };
}

export function usePaywallPurchases(onPurchaseComplete: () => void): PaywallPurchaseState {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [hasPlus, setHasPlus] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const handlePurchaseSuccess = (purchase: Purchase) => {
    if (purchase.productId !== DAYMARK_PLUS_PRODUCT_ID) return;
    void finishIapTransaction({ purchase, isConsumable: false })
      .then(() => {
        setHasPlus(true);
        setIsPurchasing(false);
        hapticSuccess();
        Alert.alert("Daymark Plus is active", "Your subscription is ready. Enjoy a clearer day.", [{ text: "Continue to Daymark", onPress: onPurchaseComplete }]);
      })
      .catch((error: unknown) => {
        setIsPurchasing(false);
        setPurchaseError(errorMessage(error, "We couldn't finish your purchase. Please try again."));
        hapticWarning();
      });
  };

  const { connected, subscriptions, activeSubscriptions, fetchProducts, getActiveSubscriptions, hasActiveSubscriptions, requestPurchase, restorePurchases } = useIAP({
    onPurchaseSuccess: handlePurchaseSuccess,
    onPurchaseError: (error) => {
      setIsPurchasing(false);
      if (isCancellation(error.message)) return;
      setPurchaseError(error.message);
      hapticWarning();
    },
    onError: (error) => setPurchaseError(error.message),
  });

  const subscription = subscriptions.find((product) => product.id === DAYMARK_PLUS_PRODUCT_ID);
  const hasActiveSubscription = hasPlus || activeSubscriptions.some((purchase) => purchase.productId === DAYMARK_PLUS_PRODUCT_ID && purchase.isActive);
  const hasFreeTrial = subscription?.platform === "ios" && subscription.introductoryPricePaymentModeIOS === "free-trial";

  useEffect(() => {
    if (!connected) return;
    void fetchProducts({ skus: [DAYMARK_PLUS_PRODUCT_ID], type: "subs" }).catch(() => undefined);
    void getActiveSubscriptions([DAYMARK_PLUS_PRODUCT_ID]).catch(() => undefined);
  }, [connected, fetchProducts, getActiveSubscriptions]);

  const handlePurchase = async () => {
    hapticMedium();
    if (hasActiveSubscription) {
      onPurchaseComplete();
      return;
    }
    if (!connected) {
      setPurchaseError("The App Store is not ready yet. Please try again in a moment.");
      return;
    }
    if (!subscription) {
      setPurchaseError(`Daymark Plus is unavailable until ${DAYMARK_PLUS_PRODUCT_ID} is configured in the store.`);
      return;
    }

    const request = purchaseRequest(subscription);
    if (!request) {
      setPurchaseError("Purchases are only available in the iOS and Android apps.");
      return;
    }
    setPurchaseError(null);
    setIsPurchasing(true);
    try {
      await requestPurchase(request);
    } catch (error: unknown) {
      setIsPurchasing(false);
      setPurchaseError(errorMessage(error, "We couldn't start the purchase. Please try again."));
    }
  };

  const handleRestore = async () => {
    hapticLight();
    setPurchaseError(null);
    setIsRestoring(true);
    try {
      await restorePurchases();
      await getActiveSubscriptions([DAYMARK_PLUS_PRODUCT_ID]);
      if (await hasActiveSubscriptions([DAYMARK_PLUS_PRODUCT_ID])) {
        setHasPlus(true);
        hapticSuccess();
        Alert.alert("Daymark Plus restored", "Your subscription is active on this device.", [{ text: "Continue to Daymark", onPress: onPurchaseComplete }]);
        return;
      }
      setPurchaseError("No active Daymark Plus subscription was found.");
    } catch (error: unknown) {
      setPurchaseError(errorMessage(error, "We couldn't restore your purchase. Please try again."));
    } finally {
      setIsRestoring(false);
    }
  };

  return { connected, subscription, hasActiveSubscription, hasFreeTrial, isPurchasing, isRestoring, purchaseError, handlePurchase, handleRestore };
}
