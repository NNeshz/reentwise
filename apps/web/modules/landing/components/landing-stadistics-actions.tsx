"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { Button } from "@reentwise/ui/src/components/button";
import type { LandingCta } from "@/modules/landing/types/landing.types";

type Props = {
  primaryCta: LandingCta;
  secondaryCta: LandingCta;
};

export function LandingStadisticsActions({ primaryCta, secondaryCta }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ delay: 0.3 }}
      className="flex w-full flex-col items-center gap-4 pt-2 sm:w-auto sm:flex-row"
    >
      <Button
        size="lg"
        className="h-12 w-full rounded-full px-8 text-base font-semibold sm:w-auto"
        asChild
      >
        <Link href={primaryCta.href}>{primaryCta.label}</Link>
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="h-12 w-full rounded-full px-8 text-base font-semibold sm:w-auto"
        asChild
      >
        <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
      </Button>
    </m.div>
  );
}
