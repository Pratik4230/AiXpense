import { getSession } from "@/lib/session";
import { AiXpenseClient } from "./AiXpenseClient";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { effectivePremium } from "@/lib/premium";

export default async function AiXpensePage() {
  const session = await getSession();
  if (!session?.user?.id) {
    return <AiXpenseClient initialIsPremium={false} />;
  }

  const dbUser = await db.collection("user").findOne(
    { _id: new ObjectId(session.user.id) },
    { projection: { isPremium: 1, bonusPremiumUntil: 1 } },
  );

  const isPremium = effectivePremium({
    isPremium: dbUser?.isPremium as boolean | undefined,
    bonusPremiumUntil: dbUser?.bonusPremiumUntil as Date | undefined,
  });

  return <AiXpenseClient initialIsPremium={isPremium} />;
}
