export type PremiumFields = {
  isPremium?: boolean | null;
  bonusPremiumUntil?: Date | string | null;
};

export function effectivePremium(user: PremiumFields, now = new Date()): boolean {
  if (user.isPremium === true) return true;
  if (!user.bonusPremiumUntil) return false;
  const until =
    user.bonusPremiumUntil instanceof Date
      ? user.bonusPremiumUntil
      : new Date(user.bonusPremiumUntil);
  return until.getTime() > now.getTime();
}
