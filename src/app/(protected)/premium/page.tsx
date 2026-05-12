import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import {
  dodoWebhookSecretConfigured,
  isDodoPaymentsConfigured,
} from "@/lib/dodo/config";
import { PremiumCheckoutClient } from "./PremiumCheckoutClient";

export default async function PremiumPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const user = await db.collection("user").findOne(
    { _id: new ObjectId(session.user.id) },
    { projection: { country: 1 } },
  );

  const country = (user?.country as string) || "IN";
  const dodoReady =
    isDodoPaymentsConfigured() && dodoWebhookSecretConfigured();
  const useInternationalCheckout = dodoReady && country !== "IN";
  const internationalBillingUnavailable = country !== "IN" && !dodoReady;

  return (
    <PremiumCheckoutClient
      useInternationalCheckout={useInternationalCheckout}
      internationalBillingUnavailable={internationalBillingUnavailable}
      country={country}
    />
  );
}
