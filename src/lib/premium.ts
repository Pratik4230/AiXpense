export type PremiumFields = {
  isPremium?: boolean | null;
};

export function effectivePremium(user: PremiumFields): boolean {
  return user.isPremium === true;
}
