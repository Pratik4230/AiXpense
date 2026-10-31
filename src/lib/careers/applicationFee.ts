import "server-only";

import { auth } from "@/lib/auth";

const DEFAULT_PUBLIC_FEE_PAISE = 10000;
const DEFAULT_ADMIN_TEST_FEE_PAISE = 100;

function readFee(name: string, fallback: number) {
  const configured = process.env[name];
  if (configured === undefined) return fallback;

  const amount = Number(configured);
  if (!Number.isSafeInteger(amount) || amount < 100 || amount > 100000 || amount % 100 !== 0) {
    throw new Error(`${name} must be a whole-rupee amount in paise between 100 and 100000`);
  }
  return amount;
}

export async function getCareerApplicationFee(requestHeaders: Headers) {
  const session = await auth.api.getSession({ headers: requestHeaders });
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const isAdmin = Boolean(adminEmail && session?.user.email?.trim().toLowerCase() === adminEmail);

  return {
    amountInPaise: isAdmin
      ? readFee("JOB_APPLICATION_ADMIN_TEST_FEE_PAISE", DEFAULT_ADMIN_TEST_FEE_PAISE)
      : readFee("JOB_APPLICATION_FEE_PAISE", DEFAULT_PUBLIC_FEE_PAISE),
    isAdminTest: isAdmin,
  };
}
