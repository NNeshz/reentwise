"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { Button } from "@reentwise/ui/src/components/button";
import type { LandingCta } from "@/modules/landing/types/landing.types";

type Props = {
  primaryCta: LandingCta;
  secondaryCta: LandingCta;
};

export function LandingHeroActions({ primaryCta, secondaryCta }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
    >
      <Button
        size="lg"
        className="h-14 w-full rounded-full bg-primary px-8 text-lg font-semibold text-primary-foreground hover:bg-primary/90 sm:w-auto"
        asChild
      >
        <Link href={primaryCta.href}>{primaryCta.label}</Link>
      </Button>
      <Button
        size="lg"
        className="h-14 w-full rounded-full bg-white/20 px-8 text-lg font-semibold text-white backdrop-blur-md hover:bg-white/30 sm:w-auto"
        asChild
      >
        <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
      </Button>
    </m.div>
  );
}
