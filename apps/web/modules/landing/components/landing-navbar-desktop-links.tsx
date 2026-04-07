"use client";

import Link from "next/link";
import { cn } from "@reentwise/ui/src/lib/utils";
import type { LandingNavLink } from "@/modules/landing/types/landing.types";

type Props = {
  links: LandingNavLink[];
  isScrolled: boolean;
};

export function LandingNavbarDesktopLinks({ links, isScrolled }: Props) {
  return (
    <div className="hidden items-center gap-6 md:flex">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isScrolled
              ? "text-muted-foreground"
              : "text-white/80 hover:text-white",
          )}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}
