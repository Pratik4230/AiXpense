export function isDodoPaymentsConfigured(): boolean {
  return Boolean(
    process.env.DODO_PAYMENTS_API_KEY?.trim() &&
      process.env.DODO_PRODUCT_ID_PREMIUM_MONTHLY?.trim() &&
      process.env.DODO_PRODUCT_ID_PREMIUM_YEARLY?.trim(),
  );
}

export function dodoWebhookSecretConfigured(): boolean {
  return Boolean(process.env.DODO_PAYMENTS_WEBHOOK_SECRET?.trim());
}

export function getDodoEnvironment(): "test_mode" | "live_mode" {
  return process.env.DODO_PAYMENTS_ENV === "live_mode"
    ? "live_mode"
    : "test_mode";
}

export function planFromDodoProductId(
  productId: string,
): "monthly" | "yearly" | null {
  if (productId === process.env.DODO_PRODUCT_ID_PREMIUM_MONTHLY) {
    return "monthly";
  }
  if (productId === process.env.DODO_PRODUCT_ID_PREMIUM_YEARLY) {
    return "yearly";
  }
  return null;
}
