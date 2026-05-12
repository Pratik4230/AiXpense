import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import { dodopaymentsClient } from "@dodopayments/better-auth";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000",
  plugins: [emailOTPClient(), dodopaymentsClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
