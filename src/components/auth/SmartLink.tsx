import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ComponentProps, ReactNode } from "react";

type ButtonVariant = ComponentProps<typeof Button>["variant"];
type ButtonSize = ComponentProps<typeof Button>["size"];

interface SmartLinkProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function SmartLink({
  children,
  variant,
  size,
  className,
}: SmartLinkProps) {
  return (
    <Button variant={variant} size={size} className={className} asChild>
      <Link href="/aixpense">{children}</Link>
    </Button>
  );
}

export function SmartTextLink({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href="/aixpense" className={className}>
      {children}
    </Link>
  );
}
