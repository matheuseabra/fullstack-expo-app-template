import { getSubscriptionStatus } from "@fullstack-expo-app-template/db/subscriptions";
import { protectedProcedure } from "../index";

export const subscriptionRouter = {
  /**
   * Server-side entitlement status for the authenticated user. RevenueCat
   * identifies the subscriber by the Better Auth user id (Purchases.logIn),
   * so the webhook-upserted row can be looked up directly by user.
   */
  status: protectedProcedure.handler(async ({ context }) => {
    return await getSubscriptionStatus(context.session.user.id);
  }),
};
