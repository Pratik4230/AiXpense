/**
 * Public base URL for auth client, OAuth redirects, and payment return URLs.
 * Set `NEXT_PUBLIC_APP_URL` (e.g. your ngrok https URL when tunneling locally).
 */
export function getConfiguredPublicAppUrl(): string | null {
  const o = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  return o || null;
}
