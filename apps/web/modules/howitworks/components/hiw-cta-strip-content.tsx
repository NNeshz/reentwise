"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { Button } from "@reentwise/ui/src/components/button";
import type { HowItWorksCta } from "@/modules/howitworks/types/howitworks.types";

type Props = {
  title: string;
  primaryCta: HowItWorksCta;
};

export function HowItWorksCtaStripContent({ title, primaryCta }: Props) {
  return (
    <div className="relative z-10 mx-auto max-w-4xl space-y-8 text-center">
      <m.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        className="font-host-grotesk text-3xl font-normal leading-tight text-white text-balance md:text-5xl"
      >
        {title}
      </m.h2>
      <m.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.08 }}
        className="flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        <Button
          size="lg"
          className="h-14 rounded-full bg-primary px-8 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
          asChild
        >
          <Link href={primaryCta.href}>{primaryCta.label}</Link>
        </Button>
      </m.div>
    </div>
  );
}
