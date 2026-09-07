import { z } from "zod";
import { env } from "@fullstack-expo-app-template/env/server";
import { upsertSubscriptionState } from "@fullstack-expo-app-template/db/subscriptions";
import type { Context } from "hono";

/**
 * RevenueCat webhook event payload.
 * See https://www.revenuecat.com/docs/integrations/webhooks/event-types-and-fields
 * Parse defensively: most fields are optional per event type.
 */
const revenueCatEventSchema = z.object({
  api_version: z.string().optional(),
  event: z.object({
    id: z.string(),
    type: z.string(),
    app_user_id: z.string(),
    product_id: z.string().optional(),
    entitlement_ids: z.array(z.string()).nullable().optional(),
    store: z.string().optional(),
    environment: z.string().optional(),
    period_type: z.string().optional(),
    transaction_id: z.string().optional(),
    original_transaction_id: z.string().optional(),
    purchased_at_ms: z.number().optional(),
    expiration_at_ms: z.number().nullable().optional(),
    event_timestamp_ms: z.number().optional(),
  }),
});

type RevenueCatEvent = z.infer<typeof revenueCatEventSchema>["event"];

/**
 * Subscription lifecycle events that change access. Other events (TEST,
 * TRANSFER, EXPERIMENT_ENROLLMENT, VIRTUAL_CURRENCY_TRANSACTION, ...) are
 * acknowledged but not persisted.
 */
const LIFECYCLE_EVENT_TYPES = new Set([
  "INITIAL_PURCHASE",
  "RENEWAL",
  "UNCANCELLATION",
  "PRODUCT_CHANGE",
  "SUBSCRIPTION_EXTENDED",
  "EXPIRATION",
  "CANCELLATION",
  "BILLING_ISSUE",
  "NON_RENEWING_PURCHASE",
]);

function entitlementIds(event: RevenueCatEvent) {
  return event.entitlement_ids ?? [];
}

function isAccessRevokingEvent(event: RevenueCatEvent) {
  // EXPIRATION removes access. A voluntary unsubscribe (CANCELLATION) keeps
  // access until the period ends; a billing-error cancellation still grants
  // grace access until RevenueCat sends EXPIRATION.
  return event.type === "EXPIRATION";
}

export async function handleRevenueCatWebhook(c: Context) {
  const secret = env.REVENUECAT_WEBHOOK_SECRET;
  if (!secret) {
    return c.json({ error: "RevenueCat webhook is not configured on this server." }, 503);
  }

  const authorization = c.req.header("authorization");
  if (authorization !== `Bearer ${secret}`) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const parsed = revenueCatEventSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid webhook payload" }, 400);
  }

  const event = parsed.data.event;
  const eventTimestampMs = event.event_timestamp_ms ?? Date.now();

  if (!LIFECYCLE_EVENT_TYPES.has(event.type)) {
    return c.json({ received: true });
  }

  const ids = entitlementIds(event);
  if (ids.length === 0) {
    return c.json({ received: true });
  }
  const entitlementId = ids[0];
  if (!entitlementId) {
    return c.json({ received: true });
  }

  try {
    await upsertSubscriptionState({
      appUserId: event.app_user_id,
      entitlementId,
      productId: event.product_id ?? "",
      store: event.store ?? null,
      environment: event.environment ?? null,
      periodType: event.period_type ?? null,
      transactionId: event.transaction_id ?? null,
      originalTransactionId: event.original_transaction_id ?? null,
      purchasedAtMs: event.purchased_at_ms ?? null,
      expirationAtMs: isAccessRevokingEvent(event) ? 0 : (event.expiration_at_ms ?? null),
      lastEventId: event.id,
      lastEventTimestampMs: eventTimestampMs,
    });
  } catch (error) {
    console.error("RevenueCat webhook: failed to persist event", event.id, error);
    return c.json({ error: "Failed to process event" }, 500);
  }

  return c.json({ received: true });
}
