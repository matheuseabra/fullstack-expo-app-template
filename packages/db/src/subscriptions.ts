import { and, desc, eq, gt } from "drizzle-orm";
import { db } from "./index";
import { DAYMARK_PLUS_ENTITLEMENT_ID, subscription } from "./schema/subscription";
import { user } from "./schema/auth";

export type SubscriptionStateInput = {
  appUserId: string;
  entitlementId: string;
  productId: string;
  store: string | null;
  environment: string | null;
  periodType: string | null;
  transactionId: string | null;
  originalTransactionId: string | null;
  purchasedAtMs: number | null;
  /** Set to 0 to revoke access immediately (e.g. EXPIRATION). */
  expirationAtMs: number | null;
  lastEventId: string;
  lastEventTimestampMs: number;
};

/**
 * Applies a RevenueCat lifecycle event to the persisted entitlement state.
 * Idempotent for retries: RevenueCat reuses the same event id on redelivery.
 * Returns `true` when the event changed state, `false` when it was a duplicate.
 */
export async function upsertSubscriptionState(input: SubscriptionStateInput) {
  const { appUserId, entitlementId, lastEventId } = input;

  const existing = await db
    .select({ id: subscription.id, lastEventId: subscription.lastEventId, userId: subscription.userId })
    .from(subscription)
    .where(and(eq(subscription.appUserId, appUserId), eq(subscription.entitlementId, entitlementId)))
    .limit(1);

  const existingRow = existing[0];

  if (existingRow && existingRow.lastEventId === lastEventId) {
    return false;
  }

  // RevenueCat identifies the subscriber by the Better Auth user id when the
  // app called Purchases.logIn; link the row when a local user matches.
  const [match] = await db.select({ id: user.id }).from(user).where(eq(user.id, appUserId)).limit(1);
  const userId = match?.id ?? existingRow?.userId ?? null;

  await db
    .insert(subscription)
    .values({ ...input, userId })
    .onConflictDoUpdate({
      target: [subscription.appUserId, subscription.entitlementId],
      set: {
        userId,
        productId: input.productId,
        store: input.store,
        environment: input.environment,
        periodType: input.periodType,
        transactionId: input.transactionId,
        originalTransactionId: input.originalTransactionId,
        purchasedAtMs: input.purchasedAtMs,
        expirationAtMs: input.expirationAtMs,
        lastEventId: input.lastEventId,
        lastEventTimestampMs: input.lastEventTimestampMs,
      },
    });

  return true;
}

export type SubscriptionStatus = {
  isPlus: boolean;
  current: {
    entitlementId: string;
    productId: string;
    store: string | null;
    environment: string | null;
    periodType: string | null;
    expirationAtMs: number | null;
  } | null;
};

/** Entitlement status for a local user, derived from unexpired subscription rows. */
export async function getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  const [active] = await db
    .select({
      entitlementId: subscription.entitlementId,
      productId: subscription.productId,
      store: subscription.store,
      environment: subscription.environment,
      periodType: subscription.periodType,
      expirationAtMs: subscription.expirationAtMs,
    })
    .from(subscription)
    .where(
      and(
        eq(subscription.userId, userId),
        eq(subscription.entitlementId, DAYMARK_PLUS_ENTITLEMENT_ID),
        gt(subscription.expirationAtMs, Date.now()),
      ),
    )
    .orderBy(desc(subscription.expirationAtMs))
    .limit(1);

  return {
    isPlus: active !== undefined,
    current: active ?? null,
  };
}
