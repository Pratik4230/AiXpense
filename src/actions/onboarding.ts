"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function completeOnboarding() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return;

  await auth.api.updateUser({
    headers: await headers(),
    body: { onboardingCompleted: true } as never,
  });

  revalidatePath("/aixpense");
}
