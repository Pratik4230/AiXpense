import Image from "next/image";

import { cn } from "@/lib/utils";

const PLAYSTORE_ICON_SRC = "/playstoreNoBG.png";

const ICON = {
  sm: { px: 36, className: "size-9" },
  md: { px: 48, className: "size-12" },
  lg: { px: 56, className: "size-14" },
} as const;

type GooglePlayIconProps = {
  className?: string;
  size?: keyof typeof ICON;
};

export function GooglePlayIcon({
  className,
  size = "md",
}: GooglePlayIconProps) {
  const { px, className: sizeClass } = ICON[size];

  return (
    <Image
      src={PLAYSTORE_ICON_SRC}
      alt=""
      width={px}
      height={px}
      sizes={`${px}px`}
      className={cn("shrink-0 object-contain", sizeClass, className)}
      aria-hidden
    />
  );
}
