"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/authClient";
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
  const router = useRouter();
  const { data: session } = useSession();

  const handleClick = () => {
    if (session?.user) {
      router.push("/aixpense");
    } else {
      router.push("/login");
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={className}
    >
      {children}
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
  const router = useRouter();
  const { data: session } = useSession();

  const handleClick = () => {
    if (session?.user) {
      router.push("/aixpense");
    } else {
      router.push("/login");
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
