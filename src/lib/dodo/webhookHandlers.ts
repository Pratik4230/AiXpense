import { connectDB } from "@/lib/db";
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
  customer: {
    customer_id: string;
    email: string;
    metadata: Record<string, unknown>;
    name: string;
  };
};

function userIdFromPayload(data: DodoSubscriptionPayload): string | null {
  const raw = data.customer?.metadata?.userId;
  if (typeof raw === "string" && raw.length > 0) return raw;
  return null;
}

async function upsertDodoSubscription(
  data: DodoSubscriptionPayload,
  opts: { cancelAtPeriodEnd?: boolean },
) {
  const userId = userIdFromPayload(data);
  if (!userId) {
    logger.warn("dodo_webhook_missing_userId", {
      data: { subscriptionId: data.subscription_id },
    });
    return;
  }

  const plan = planFromDodoProductId(data.product_id);
  if (!plan) {
    logger.warn("dodo_webhook_unknown_product", {
      userId,
      data: { productId: data.product_id, subscriptionId: data.subscription_id },
    });
    return;
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
  await upsertDodoSubscription(data, { cancelAtPeriodEnd: false });
  const userId = userIdFromPayload(data);
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
  await upsertDodoSubscription(data, {});
  const userId = userIdFromPayload(data);
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
  await upsertDodoSubscription(data, {
    cancelAtPeriodEnd: data.cancel_at_next_billing_date === true,
  });
  const userId = userIdFromPayload(data);
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
  await upsertDodoSubscription(data, {});
  const userId = userIdFromPayload(data);
  if (userId) await updateUserPremiumFlag(userId, false);
}

export async function onDodoSubscriptionOnHold(
  payload: { data: DodoSubscriptionPayload },
) {
  const data = payload.data;
  await upsertDodoSubscription(data, {});
  const userId = userIdFromPayload(data);
  if (userId) await updateUserPremiumFlag(userId, false);
}
