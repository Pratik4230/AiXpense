import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GooglePlayIcon } from "@/components/landing/GooglePlayIcon";
import { PLAY_STORE_URL } from "@/constants/play-store";
import { cn } from "@/lib/utils";

type PlayStoreLinkProps = {
  className?: string;
  label?: string;
  size?: "default" | "lg";
  variant?: React.ComponentProps<typeof Button>["variant"];
  showExternalIcon?: boolean;
};

export function PlayStoreLink({
  className,
  label = "Get on Google Play",
  size = "default",
  variant = "outline",
  showExternalIcon = false,
}: PlayStoreLinkProps) {
  return (
    <Button
      size={size}
      variant={variant}
      className={cn("gap-2.5 rounded-full", className)}
      asChild
    >
      <Link
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} (opens Google Play)`}
      >
        <GooglePlayIcon size={size === "lg" ? "lg" : "md"} />
        {label}
        {showExternalIcon ? (
          <ExternalLink className="size-3.5 opacity-70" aria-hidden />
        ) : null}
      </Link>
    </Button>
  );
}
