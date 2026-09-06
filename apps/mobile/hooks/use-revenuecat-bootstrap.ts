import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { configureRevenueCat, Purchases } from "@/lib/revenuecat";

/**
 * Configures RevenueCat on launch and links the RevenueCat subscriber to the
 * authenticated Daymark user so webhook events can attribute purchases to a
 * local user id (RevenueCat `appUserID` == Better Auth user id).
 *
 * Runs once per app session; anonymous users keep RevenueCat's generated id.
 */
export function useRevenueCatBootstrap() {
  const session = authClient.useSession();
  const userId = session.data?.user?.id ?? null;
  const lastSyncedId = useRef<string | null>(null);

  useEffect(() => {
    if (userId === null) return;

    configureRevenueCat();
    if (lastSyncedId.current === userId) return;

    const previous = lastSyncedId.current;
    lastSyncedId.current = userId;
    Purchases.logIn(userId).catch((error: unknown) => {
      lastSyncedId.current = previous;
      console.warn("RevenueCat logIn failed", error);
    });
  }, [userId]);

  useEffect(() => {
    if (userId !== null || lastSyncedId.current === null) return;

    Purchases.logOut()
      .catch((error: unknown) => {
        console.warn("RevenueCat logOut failed", error);
      })
      .finally(() => {
        lastSyncedId.current = null;
      });
  }, [userId]);
}
