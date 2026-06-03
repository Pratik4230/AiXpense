import "server-only";

import type { GenericEndpointContext } from "better-auth";
import { ObjectId } from "mongodb";
import { db } from "@/lib/db";
import {
  CLIENT_PLATFORM_HEADER,
  type ClientPlatform,
  parseClientPlatform,
} from "@/lib/auth/clientPlatform";

function readRequestHeader(
  headers: GenericEndpointContext["headers"] | undefined,
  name: string,
): string | null {
  if (!headers) return null;
  if (typeof headers.get === "function") {
    return headers.get(name) ?? headers.get(name.toLowerCase()) ?? null;
  }
  const record = headers as unknown as Record<
    string,
    string | string[] | undefined
  >;
  const raw = record[name] ?? record[name.toLowerCase()];
  if (Array.isArray(raw)) return raw[0] ?? null;
  return raw ?? null;
}

export function getClientPlatformFromContext(
  context: GenericEndpointContext | null | undefined,
): ClientPlatform | null {
  if (!context) return null;
  return parseClientPlatform(
    readRequestHeader(context.headers, CLIENT_PLATFORM_HEADER),
  );
}

/** Signup source: explicit body field, then client header, then web fallback. */
export function resolveSignupPlatform(
  user: Record<string, unknown>,
  context: GenericEndpointContext | null | undefined,
): ClientPlatform {
  return (
    parseClientPlatform(user.signupPlatform) ??
    getClientPlatformFromContext(context) ??
    "web"
  );
}

export async function updateUserLastActivePlatform(
  userId: string,
  platform: ClientPlatform,
): Promise<void> {
  const filter = ObjectId.isValid(userId)
    ? { _id: new ObjectId(userId) }
    : { id: userId };

  await db.collection("user").updateOne(filter, {
    $set: { lastActivePlatform: platform, updatedAt: new Date() },
  });
}
