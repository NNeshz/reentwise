"use client";

import Link from "next/link";
import { Button } from "@reentwise/ui/src/components/button";
import { cn } from "@reentwise/ui/src/lib/utils";

type Props = {
  isScrolled: boolean;
  hasSession: boolean;
  className?: string;
  onNavigate?: () => void;
  mobileLabel?: string;
};

export function LandingNavbarSessionCta({
  isScrolled,
  hasSession,
  className,
  onNavigate,
  mobileLabel,
}: Props) {
  const href = hasSession ? "/dashboard" : "/auth";
  const label = mobileLabel ?? (hasSession ? "Dashboard" : "Comenzar");

  return (
    <Button
      variant={isScrolled ? "default" : "secondary"}
      className={cn(
        "rounded-full px-6 font-semibold",
        !isScrolled && "bg-primary text-primary-foreground hover:bg-primary/90",
        className,
      )}
      asChild
    >
      <Link href={href} onClick={onNavigate}>
        {label}
      </Link>
    </Button>
  );
}
