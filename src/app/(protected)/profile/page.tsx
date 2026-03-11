import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ProfileInfoCard,
  ChangePasswordCard,
  PlanUsageCard,
  DangerZoneCard,
  MyReportsCard,
} from "@/components/profile";
import { getSubscription } from "@/actions/subscription";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getISTMidnight } from "@/lib/ist";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session.user as any;
  const todayISTMidnight = getISTMidnight();

  const [dbUser, subscription] = await Promise.all([
    db.collection("user").findOne(
      { _id: new ObjectId(user.id) },
      { projection: { freeTrials: 1, freeTrialResetAt: 1, isPremium: 1 } },
    ),
    getSubscription(user.id),
  ]);

  const isPremiumLive = dbUser?.isPremium ?? user.isPremium ?? false;
  const lastReset = dbUser?.freeTrialResetAt ? new Date(dbUser.freeTrialResetAt) : new Date(0);
  const freeTrialsLive = isPremiumLive
    ? 0
    : lastReset < todayISTMidnight
    ? 7
    : (dbUser?.freeTrials ?? 0);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-5 sm:py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/aixpense">
          <Button variant="ghost" size="icon" className="size-8 shrink-0">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold">Settings</h1>
      </div>
      <ProfileInfoCard name={user.name} email={user.email} />
      <PlanUsageCard
        isPremium={isPremiumLive}
        freeTrials={freeTrialsLive}
        subscription={subscription}
      />
      <MyReportsCard />
      <ChangePasswordCard />
      <DangerZoneCard />
    </div>
  );
}
