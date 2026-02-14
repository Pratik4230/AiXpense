"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateName(name: string) {
  const session = await auth.api.getSession({ headers: await headers() });
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

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  const session = await auth.api.getSession({ headers: await headers() });
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
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Not authenticated" };

  try {
    await auth.api.deleteUser({
      headers: await headers(),
      body: { callbackURL: "/login" },
    });
    return { success: true };
  } catch {
    return { error: "Failed to delete account" };
  }
}
