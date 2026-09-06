import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Purchases } from "@/lib/revenuecat";
import { client } from "@/utils/orpc";
import { DAYMARK_PLUS_ENTITLEMENT_ID } from "@/constants/purchases";

async function localEntitlementActive() {
  const customerInfo = await Purchases.getCustomerInfo();
  return customerInfo.entitlements.active[DAYMARK_PLUS_ENTITLEMENT_ID] !== undefined;
}

/**
 * Whether the current user has Daymark Plus.
 *
 * Signed-in users get the server-verified status (RevenueCat webhook → DB).
 * Signed-out users fall back to the SDK's locally cached CustomerInfo, which
 * still reflects the anonymous subscriber's purchases.
 */
export function usePlusEntitlement() {
  const session = authClient.useSession();
  const userId = session.data?.user?.id ?? null;

  return useQuery({
    queryKey: ["subscription", "status", userId ?? "anonymous"],
    queryFn: async () => {
      if (userId) {
        const status = await client.subscription.status();
        if (status.isPlus) return true;
        // Server may not have processed the webhook yet; trust the SDK too.
        return await localEntitlementActive();
      }
      return await localEntitlementActive();
    },
    enabled: !!session.data || session.isPending === false,
    staleTime: 60_000,
  });
}
