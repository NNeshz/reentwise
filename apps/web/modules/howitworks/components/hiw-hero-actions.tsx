"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { Button } from "@reentwise/ui/src/components/button";
import type { HowItWorksCta } from "@/modules/howitworks/types/howitworks.types";

type Props = {
  primaryCta: HowItWorksCta;
};

export function HowItWorksHeroActions({ primaryCta }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-4"
    >
      <Button
        size="lg"
        className="h-12 rounded-full bg-primary px-8 font-semibold text-primary-foreground hover:bg-primary/90"
        asChild
      >
        <Link href={primaryCta.href}>{primaryCta.label}</Link>
      </Button>
    </m.div>
  );
}
