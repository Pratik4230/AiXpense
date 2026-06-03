export const CLIENT_PLATFORM_HEADER = "x-aixpense-client";

export type ClientPlatform = "web" | "android";

export function parseClientPlatform(value: unknown): ClientPlatform | null {
  if (value === "web" || value === "android") return value;
  return null;
}
