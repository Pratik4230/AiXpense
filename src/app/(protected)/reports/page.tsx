import { Suspense } from "react";
import { getSession } from "@/lib/session";
import { ReportsClient } from "./ReportsClient";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { effectivePremium } from "@/lib/premium";

export default async function ReportsPage() {
  const session = await getSession();
  let isPremium = false;
  if (session?.user?.id) {
    const dbUser = await db.collection("user").findOne(
      { _id: new ObjectId(session.user.id) },
      { projection: { isPremium: 1 } },
    );
    isPremium = effectivePremium({
      isPremium: dbUser?.isPremium as boolean | undefined,
    });
  }

  return (
    <Suspense>
      <ReportsClient isPremium={isPremium} />
    </Suspense>
  );
}
