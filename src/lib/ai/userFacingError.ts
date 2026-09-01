import { APICallError, LoadAPIKeyError } from "ai";

export const AI_UNAVAILABLE_MESSAGE =
  "AI is temporarily unavailable. Please try again later.";

export const AI_QUOTA_EXHAUSTED_MESSAGE =
  "Insufficient balance. Please try again later.";

export const AI_RATE_LIMIT_MESSAGE =
  "Too many requests. Please wait a moment and try again.";

export const AI_GENERIC_FAILURE_MESSAGE =
  "Something went wrong. Please try again.";

export const VOICE_UNAVAILABLE_MESSAGE =
  "Insufficient balance. Please try again later.";

export const VOICE_RATE_LIMIT_MESSAGE =
  "Too many requests. Please wait and try again.";

function collectErrorText(error: unknown): string {
  const parts: string[] = [];

  if (typeof error === "string") {
    parts.push(error);
  } else if (error instanceof Error) {
    parts.push(error.message);
    if (error.cause) parts.push(collectErrorText(error.cause));
  }

  if (APICallError.isInstance(error)) {
    if (error.responseBody) parts.push(error.responseBody);
    if (error.statusCode != null) parts.push(String(error.statusCode));
  }

  return parts.join(" ").toLowerCase();
}

function isQuotaExhausted(text: string): boolean {
  return (
    text.includes("insufficient_quota") ||
    text.includes("exceeded your current quota") ||
    text.includes("billing hard limit") ||
    text.includes("credit balance") ||
    text.includes("out of credits") ||
    text.includes("quota exceeded") ||
    text.includes("insufficient balance")
  );
}

function isRateLimited(text: string, statusCode?: number): boolean {
  return (
    statusCode === 429 ||
    text.includes("rate limit") ||
    text.includes("too many requests") ||
    text.includes("requests per minute")
  );
}

function isAuthOrConfigError(
  text: string,
  statusCode?: number,
  error?: unknown,
): boolean {
  return (
    LoadAPIKeyError.isInstance(error) ||
    statusCode === 401 ||
    text.includes("incorrect api key") ||
    text.includes("invalid_api_key") ||
    text.includes("api key") ||
    text.includes("authentication") ||
    text.includes("unauthorized")
  );
}

function isProviderDown(text: string, statusCode?: number): boolean {
  return (
    statusCode === 503 ||
    statusCode === 502 ||
    statusCode === 504 ||
    text.includes("overloaded") ||
    text.includes("server error") ||
    text.includes("service unavailable")
  );
}

export function getUserFacingAiErrorMessage(error: unknown): string {
  const text = collectErrorText(error);
  const statusCode = APICallError.isInstance(error)
    ? error.statusCode
    : undefined;

  if (isQuotaExhausted(text) || isAuthOrConfigError(text, statusCode, error)) {
    return AI_QUOTA_EXHAUSTED_MESSAGE;
  }

  if (isRateLimited(text, statusCode)) {
    return AI_RATE_LIMIT_MESSAGE;
  }

  if (isProviderDown(text, statusCode)) {
    return AI_UNAVAILABLE_MESSAGE;
  }

  return AI_GENERIC_FAILURE_MESSAGE;
}

export function getAiErrorHttpStatus(error: unknown): number {
  const text = collectErrorText(error);
  const statusCode = APICallError.isInstance(error)
    ? error.statusCode
    : undefined;

  if (isRateLimited(text, statusCode)) return 429;
  if (
    isQuotaExhausted(text) ||
    isAuthOrConfigError(text, statusCode, error) ||
    isProviderDown(text, statusCode)
  ) {
    return 503;
  }

  return 500;
}

export function getUserFacingVoiceErrorMessage(
  statusCode?: number,
  responseBody?: string,
): string {
  const text = `${statusCode ?? ""} ${responseBody ?? ""}`.toLowerCase();

  if (isQuotaExhausted(text) || statusCode === 401 || statusCode === 403) {
    return VOICE_UNAVAILABLE_MESSAGE;
  }

  if (isRateLimited(text, statusCode)) {
    return VOICE_RATE_LIMIT_MESSAGE;
  }

  if (isProviderDown(text, statusCode) || (statusCode != null && statusCode >= 500)) {
    return VOICE_UNAVAILABLE_MESSAGE;
  }

  return VOICE_UNAVAILABLE_MESSAGE;
}

/** Parse AI SDK / fetch error payloads into a user-safe chat message. */
export function parseChatErrorMessage(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return AI_GENERIC_FAILURE_MESSAGE;

  const lower = trimmed.toLowerCase();
  if (
    lower.includes("no free trials remaining") ||
    lower.includes("upgrade to premium")
  ) {
    return trimmed;
  }

  try {
    const parsed = JSON.parse(trimmed) as { error?: unknown; message?: unknown };
    if (typeof parsed.error === "string" && parsed.error.trim()) {
      return parseChatErrorMessage(parsed.error);
    }
    if (typeof parsed.message === "string" && parsed.message.trim()) {
      return parseChatErrorMessage(parsed.message);
    }
  } catch {
    /* not JSON */
  }

  return getUserFacingAiErrorMessage(new Error(trimmed));
}
