import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

/**
 * Entitlement identifier that grants Daymark Plus access. Must match the
 * entitlement configured in the RevenueCat dashboard and used by the mobile
 * SDK (`apps/mobile/constants/purchases.ts`).
 */
export const DAYMARK_PLUS_ENTITLEMENT_ID = "daymark_plus";

/**
 * Current RevenueCat subscription state for a subscriber + entitlement.
 * The webhook handler upserts one row per (app_user_id, entitlement_id), so
 * this table can answer "is this user on Daymark Plus?" from the database
 * without trusting client SDK state.
 *
 * `appUserId` is the RevenueCat subscriber id. When the mobile client has
 * identified the user (Purchases.logIn with the Better Auth user id), it
 * equals `user.id` and `userId` links the row to the local account.
 */
export const subscription = sqliteTable(
  "subscription",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    appUserId: text("app_user_id").notNull(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    entitlementId: text("entitlement_id").notNull(),
    productId: text("product_id").notNull(),
    store: text("store"),
    environment: text("environment"),
    periodType: text("period_type"),
    transactionId: text("transaction_id"),
    originalTransactionId: text("original_transaction_id"),
    purchasedAtMs: integer("purchased_at_ms"),
    expirationAtMs: integer("expiration_at_ms"),
    lastEventId: text("last_event_id"),
    lastEventTimestampMs: integer("last_event_timestamp_ms").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("subscription_app_user_entitlement_uidx").on(table.appUserId, table.entitlementId),
    index("subscription_user_id_idx").on(table.userId),
  ],
);
