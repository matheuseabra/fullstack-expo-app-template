# In-app purchases

Daymark Plus uses [`expo-iap`](https://github.com/hyodotdev/openiap) for a store-backed auto-renewable subscription. The paywall is intentionally isolated at `apps/mobile/app/paywall.tsx`; the rest of the app only needs to react to the resulting entitlement.

## Local setup

Set the product identifier in `apps/mobile/.env`:

```bash
EXPO_PUBLIC_IAP_PRODUCT_ID=com.daymark.plus.monthly
```

The identifier must exactly match an active subscription in App Store Connect (iOS) or Google Play Console (Android). The example value is only a placeholder until the store product is created.

Because IAP is a native module, Expo Go cannot load this flow. Use a development build:

```bash
bun run dev:native -- --ios
```

## Runtime flow

1. `useIAP` connects to the platform store.
2. The paywall fetches the configured subscription and displays the store price.
3. The CTA requests the platform subscription purchase.
4. The purchase-success callback finishes the non-consumable subscription transaction and marks the local session as active.
5. Restore uses the platform restore flow and checks active subscriptions again.

If the store product is not configured or the simulator cannot reach the store, the paywall stays usable and shows an actionable unavailable/error state. This is expected in a development build without StoreKit configuration or a sandbox account.

## Testing

For iOS, configure the subscription in App Store Connect and test with a Sandbox Apple ID, or add a local StoreKit configuration to the development scheme. Purchases are not completed against production accounts during development. See [Apple's sandbox testing guide](https://developer.apple.com/documentation/storekit/testing-in-app-purchases-with-sandbox).

## Production hardening

The current client flow is the native integration seam, not a complete entitlement security boundary. Before shipping paid access:

- verify the App Store signed transaction on the server using the App Store Server API or signed transaction data;
- persist the verified entitlement in the server database and associate it with the authenticated user;
- grant premium access from the server entitlement, not only the local `hasPlus` state;
- only finish the store transaction after the server accepts the verification;
- implement equivalent Google Play purchase-token verification for Android.

For teams that do not want to operate receipt verification, RevenueCat is an alternative service layer. Keep the product ID and provider-specific credentials in server configuration; `EXPO_PUBLIC_*` values are public by design.
