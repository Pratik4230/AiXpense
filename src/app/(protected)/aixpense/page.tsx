import { getSession } from "@/lib/session";
import { AiXpenseClient } from "./AiXpenseClient";

interface SessionUser {
  isPremium?: boolean;
}

export default async function AiXpensePage() {
  const session = await getSession();
  const isPremium = (session?.user as SessionUser)?.isPremium ?? false;

  return <AiXpenseClient initialIsPremium={isPremium} />;
}
