import mongoose from "mongoose";
import { getISTDateKey, istDateKeysDiffDays } from "@/lib/ist";

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

export function isMobileStreakClient(req: Request): boolean {
  if (req.headers.get("X-AiXpense-Client") !== "native") return false;
  const secret = process.env.AIXPENSE_MOBILE_STREAK_KEY;
  if (secret) {
    return req.headers.get("X-AiXpense-Mobile-Key") === secret;
  }
  return true;
}

export type StreakUserFields = {
  streakDayKey?: string | null;
  streakChatsToday?: number | null;
  streakCount?: number | null;
  streakLastQualifiedDayKey?: string | null;
  streakRewardGrantedAt?: Date | string | null;
  bonusPremiumUntil?: Date | string | null;
};

/** After a successful chat quota consume (mobile only). */
export async function applyMobileChatStreak(userId: string): Promise<void> {
  const coll = mongoose.connection.db!.collection("user");
  const user = (await coll.findOne(
    { _id: new mongoose.Types.ObjectId(userId) },
    {
      projection: {
        streakDayKey: 1,
        streakChatsToday: 1,
        streakCount: 1,
        streakLastQualifiedDayKey: 1,
        streakRewardGrantedAt: 1,
        bonusPremiumUntil: 1,
      },
    },
  )) as StreakUserFields | null;

  if (!user) return;

  const todayKey = getISTDateKey();
  const lastQ = user.streakLastQualifiedDayKey ?? null;

  let streakCount = user.streakCount ?? 0;
  if (lastQ) {
    const gapToToday = istDateKeysDiffDays(lastQ, todayKey);
    if (gapToToday >= 2) streakCount = 0;
  }

  const prevChats =
    user.streakDayKey === todayKey ? (user.streakChatsToday ?? 0) : 0;
  const chatsToday = prevChats + 1;

  const now = new Date();
  const updates: Record<string, unknown> = {
    streakDayKey: todayKey,
    streakChatsToday: chatsToday,
  };

  let grantReward = false;

  if (chatsToday === 3 && prevChats < 3) {
    if (!lastQ) {
      streakCount = 1;
    } else {
      const gap = istDateKeysDiffDays(lastQ, todayKey);
      if (gap >= 2) streakCount = 1;
      else if (gap === 1) streakCount += 1;
      else streakCount = Math.max(1, streakCount);
    }
    updates.streakLastQualifiedDayKey = todayKey;

    const rewardAt = user.streakRewardGrantedAt
      ? new Date(user.streakRewardGrantedAt)
      : null;
    if (streakCount === 20 && !rewardAt) {
      grantReward = true;
    }
  }

  updates.streakCount = streakCount;

  if (grantReward) {
    const currentBonus = user.bonusPremiumUntil
      ? new Date(user.bonusPremiumUntil)
      : null;
    const base =
      currentBonus && currentBonus.getTime() > now.getTime()
        ? currentBonus
        : now;
    updates.bonusPremiumUntil = new Date(base.getTime() + NINETY_DAYS_MS);
    updates.streakRewardGrantedAt = now;
  }

  await coll.updateOne(
    { _id: new mongoose.Types.ObjectId(userId) },
    { $set: updates },
  );
}

export type StreakStatusPayload = {
  todayKey: string;
  chatsToday: number;
  qualifiedToday: boolean;
  streakCount: number;
  targetDays: number;
  rewardGranted: boolean;
  bonusPremiumUntil: string | null;
};

/** Read-only streak state for GET /api/streak-status (lazy gap reset reflected in counts). */
export function buildStreakStatus(user: StreakUserFields): StreakStatusPayload {
  const todayKey = getISTDateKey();
  const lastQ = user.streakLastQualifiedDayKey ?? null;

  let streakCount = user.streakCount ?? 0;
  if (lastQ) {
    const gapToToday = istDateKeysDiffDays(lastQ, todayKey);
    if (gapToToday >= 2) streakCount = 0;
  }

  const chatsToday =
    user.streakDayKey === todayKey ? (user.streakChatsToday ?? 0) : 0;
  const qualifiedToday = lastQ === todayKey;

  const rewardAt = user.streakRewardGrantedAt
    ? new Date(user.streakRewardGrantedAt)
    : null;
  const bonus = user.bonusPremiumUntil
    ? new Date(user.bonusPremiumUntil)
    : null;

  return {
    todayKey,
    chatsToday,
    qualifiedToday,
    streakCount,
    targetDays: 20,
    rewardGranted: Boolean(rewardAt),
    bonusPremiumUntil:
      bonus && bonus.getTime() > Date.now() ? bonus.toISOString() : null,
  };
}
