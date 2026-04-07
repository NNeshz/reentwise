"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { IconVectorBezier2 } from "@tabler/icons-react";
import { Button } from "@reentwise/ui/src/components/button";
import type { LandingCta } from "@/modules/landing/types/landing.types";

type Props = {
  badgeLabel: string;
  title: string;
  lead: string;
  cta: LandingCta;
};

export function LandingFaqHeader({ badgeLabel, title, lead, cta }: Props) {
  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
      <div className="flex max-w-xl flex-col items-start space-y-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background px-3 py-1.5 shadow-sm"
        >
          <IconVectorBezier2 className="h-4 w-4 text-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {badgeLabel}
          </span>
        </m.div>

        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ delay: 0.1 }}
          className="font-host-grotesk text-4xl font-medium leading-[1.1] tracking-tight text-foreground text-balance md:text-5xl"
        >
          {title}
        </m.h2>
      </div>

      <div className="flex h-full flex-col items-start justify-center space-y-6 lg:items-end">
        <m.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ delay: 0.2 }}
          className="max-w-sm text-lg leading-relaxed text-muted-foreground lg:text-right"
        >
          {lead}
        </m.p>

        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            className="rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            asChild
          >
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        </m.div>
      </div>
    </div>
  );
}
