export const SITE_URL = "https://aixpense.in" as const;

/** Public support address for legal pages; prefers ADMIN_EMAIL when set at build time. */
export function getSupportEmail(): string {
  const email = process.env.ADMIN_EMAIL?.trim();
  if (email && email.includes("@")) return email;
  return "contact@aixpense.in";
}
