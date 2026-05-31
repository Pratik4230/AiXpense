import { PLAY_STORE_APP_NAME, PLAY_STORE_URL } from "@/constants/play-store";
import { cn } from "@/lib/utils";

type PlayStoreTextLinkProps = {
  children?: React.ReactNode;
  className?: string;
};

/** Crawlable inline link to the Play Store listing (for SEO copy in legal/marketing pages). */
export function PlayStoreTextLink({
  children,
  className,
}: PlayStoreTextLinkProps) {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("text-primary hover:underline font-medium", className)}
      aria-label={`${PLAY_STORE_APP_NAME} on Google Play (opens in new tab)`}
    >
      {children ?? "Google Play Store"}
    </a>
  );
}
