"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

export async function updateName(name: string) {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: { name: name.trim() },
    });
    revalidatePath("/profile");
    return { success: true };
  } catch {
    return { error: "Failed to update name" };
  }
}

export async function updateCurrency(currency: string, country: string) {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  try {
    await auth.api.updateUser({
      headers: await headers(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: { currency, country } as any,
    });
    revalidatePath("/profile");
    return { success: true };
  } catch {
    return { error: "Failed to update currency" };
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: { currentPassword, newPassword, revokeOtherSessions: true },
    });
    return { success: true };
  } catch {
    return { error: "Current password is incorrect" };
  }
}

export async function deleteAccount() {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  try {
    await auth.api.deleteUser({
      headers: await headers(),
      body: {} as { callbackURL?: string; password?: string; token?: string },
    });
    return { success: true };
  } catch {
    return { error: "Failed to delete account" };
  }
}
