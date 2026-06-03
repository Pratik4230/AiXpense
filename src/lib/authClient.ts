import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import { dodopaymentsClient } from "@dodopayments/better-auth";
import { getConfiguredPublicAppUrl } from "@/lib/publicAppUrl";
import { CLIENT_PLATFORM_HEADER } from "@/lib/auth/clientPlatform";

export const authClient = createAuthClient({
  // Dodo Better Auth adaptor: prefer BETTER_AUTH_URL; keep NEXT_PUBLIC_APP_URL for same-origin browser API.
  baseURL:
    getConfiguredPublicAppUrl() ??
    process.env.BETTER_AUTH_URL?.trim().replace(/\/$/, "") ??
    "http://localhost:3000",
  fetchOptions: {
    headers: {
      [CLIENT_PLATFORM_HEADER]: "web",
    },
  },
  plugins: [emailOTPClient(), dodopaymentsClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
