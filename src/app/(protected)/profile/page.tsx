import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ProfileInfoCard,
  ChangePasswordCard,
  PlanUsageCard,
  DangerZoneCard,
  SessionsCard,
} from "@/components/profile";
import { getSubscription } from "@/actions/subscription";
import { getSessions } from "@/actions/user";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session.user as any;
  const subscription = await getSubscription();
  const { sessions, currentSessionId } = await getSessions();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/aixpense">
          <Button variant="ghost" size="icon" className="size-8">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      <ProfileInfoCard name={user.name} email={user.email} />
      <PlanUsageCard
        isPremium={user.isPremium ?? false}
        freeTrials={user.freeTrials ?? 0}
        subscription={subscription}
      />
      <ChangePasswordCard />
      <SessionsCard sessions={sessions} currentSessionId={currentSessionId} />
      <DangerZoneCard />
    </div>
  );
}
