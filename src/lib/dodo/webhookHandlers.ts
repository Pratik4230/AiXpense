import { connectDB, db } from "@/lib/db";
import { Subscription } from "@/models";
import { updateUserPremiumFlag } from "@/lib/razorpay/subscription";
import { planFromDodoProductId } from "@/lib/dodo/config";
import { logger } from "@/lib/logger";

type DodoSubscriptionPayload = {
  subscription_id: string;
  product_id: string;
  status: string;
  previous_billing_date: Date;
  next_billing_date: Date;
  cancel_at_next_billing_date: boolean;
  /** Checkout / API metadata (strings); includes `userId` when checkout sets it. */
  metadata?: Record<string, unknown>;
  customer: {
    customer_id: string;
    email: string;
    metadata: Record<string, unknown>;
    name: string;
  };
};

function stringMeta(
  meta: Record<string, unknown> | undefined,
  key: string,
): string | null {
  if (!meta) return null;
  const v = meta[key];
  if (typeof v === "string" && v.length > 0) return v;
  return null;
}

async function resolveDodoWebhookUserId(
  data: DodoSubscriptionPayload,
): Promise<string | null> {
  const fromCustomer = stringMeta(data.customer?.metadata, "userId");
  if (fromCustomer) return fromCustomer;

  const fromSubMeta =
    stringMeta(data.metadata, "userId") ??
    stringMeta(data.metadata, "referenceId");
  if (fromSubMeta) return fromSubMeta;

  const email = data.customer?.email;
  if (typeof email !== "string" || !email.trim()) return null;

  await connectDB();
  const user = await db.collection("user").findOne(
    { email: email.toLowerCase().trim() },
    { projection: { _id: 1 } },
  );
  if (user?._id && typeof user._id.toString === "function") {
    return user._id.toString();
  }
  return null;
}

async function upsertDodoSubscription(
  data: DodoSubscriptionPayload,
  opts: { cancelAtPeriodEnd?: boolean },
): Promise<string | null> {
  const userId = await resolveDodoWebhookUserId(data);
  if (!userId) {
    logger.warn("dodo_webhook_missing_userId", {
      data: { subscriptionId: data.subscription_id },
    });
    return null;
  }

  const plan = planFromDodoProductId(data.product_id);
  if (!plan) {
    logger.warn("dodo_webhook_unknown_product", {
      userId,
      data: { productId: data.product_id, subscriptionId: data.subscription_id },
    });
    return null;
  }

  await connectDB();

  const status =
    data.status === "active"
      ? "active"
      : data.status === "on_hold"
        ? "past_due"
        : data.status === "cancelled"
          ? "cancelled"
          : data.status === "expired"
            ? "expired"
            : data.status === "failed"
              ? "past_due"
              : data.status === "pending"
                ? "created"
                : "created";

  const cancelAtPeriodEnd =
    opts.cancelAtPeriodEnd ?? data.cancel_at_next_billing_date === true;

  await Subscription.findOneAndUpdate(
    { dodoSubscriptionId: data.subscription_id },
    {
      $set: {
        userId,
        billingProvider: "dodo",
        dodoSubscriptionId: data.subscription_id,
        plan,
        status,
        razorpayPlanId: data.product_id,
        currentPeriodStart: data.previous_billing_date,
        currentPeriodEnd: data.next_billing_date,
        cancelAtPeriodEnd,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return userId;
}

function shouldKeepPremiumAfterCancel(data: DodoSubscriptionPayload): boolean {
  return (
    data.cancel_at_next_billing_date === true &&
    data.status === "active" &&
    data.next_billing_date.getTime() > Date.now()
  );
}

export async function onDodoSubscriptionActiveLike(
  payload: { data: DodoSubscriptionPayload },
) {
  const data = payload.data;
  const userId = await upsertDodoSubscription(data, { cancelAtPeriodEnd: false });
  if (userId && data.status === "active") {
    await updateUserPremiumFlag(userId, true);
  }
}

export async function onDodoSubscriptionRenewedLike(
  payload: { data: DodoSubscriptionPayload },
) {
  await onDodoSubscriptionActiveLike(payload);
}

export async function onDodoSubscriptionUpdatedLike(
  payload: { data: DodoSubscriptionPayload },
) {
  const data = payload.data;
  const userId = await upsertDodoSubscription(data, {});
  if (!userId) return;
  if (data.status === "active") {
    await updateUserPremiumFlag(userId, true);
  } else if (
    data.status === "expired" ||
    data.status === "failed" ||
    data.status === "on_hold"
  ) {
    await updateUserPremiumFlag(userId, false);
  }
}

export async function onDodoSubscriptionCancelled(
  payload: { data: DodoSubscriptionPayload },
) {
  const data = payload.data;
  const userId = await upsertDodoSubscription(data, {
    cancelAtPeriodEnd: data.cancel_at_next_billing_date === true,
  });
  if (!userId) return;

  if (shouldKeepPremiumAfterCancel(data)) {
    await updateUserPremiumFlag(userId, true);
    return;
  }
  await updateUserPremiumFlag(userId, false);
}

export async function onDodoSubscriptionExpiredOrFailed(
  payload: { data: DodoSubscriptionPayload },
) {
  const data = payload.data;
  const userId = await upsertDodoSubscription(data, {});
  if (userId) await updateUserPremiumFlag(userId, false);
}

export async function onDodoSubscriptionOnHold(
  payload: { data: DodoSubscriptionPayload },
) {
  const data = payload.data;
  const userId = await upsertDodoSubscription(data, {});
  if (userId) await updateUserPremiumFlag(userId, false);
}
