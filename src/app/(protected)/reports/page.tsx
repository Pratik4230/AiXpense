import { Suspense } from "react";
import { getSession } from "@/lib/session";
import { ReportsClient } from "./ReportsClient";

export default async function ReportsPage() {
  const session = await getSession();
  const isPremium =
    (session?.user as { isPremium?: boolean })?.isPremium ?? false;

  return (
    <Suspense>
      <ReportsClient isPremium={isPremium} />
    </Suspense>
  );
}
