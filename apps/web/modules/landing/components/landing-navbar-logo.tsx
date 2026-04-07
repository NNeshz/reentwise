"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@reentwise/ui/src/lib/utils";
import { landingFooterContent } from "@/modules/landing/data";

type Props = {
  isScrolled: boolean;
  mobileMenuOpen: boolean;
  logoInvert: boolean;
};

export function LandingNavbarLogo({
  isScrolled,
  mobileMenuOpen,
  logoInvert,
}: Props) {
  return (
    <Link href="/" className="z-50 flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="reentwise Logo"
        width={24}
        height={24}
        className={cn(
          "object-contain transition-all",
          logoInvert ? "invert" : isScrolled || mobileMenuOpen ? "" : "invert",
        )}
      />
      <span
        className={cn(
          "text-lg font-bold transition-colors",
          isScrolled || mobileMenuOpen
            ? "text-foreground"
            : "hidden text-white md:block",
          !isScrolled && "md:text-white",
        )}
      >
        {landingFooterContent.brandName}
      </span>
    </Link>
  );
}
