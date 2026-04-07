"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { Button } from "@reentwise/ui/src/components/button";
import type { HowItWorksCta } from "@/modules/howitworks/types/howitworks.types";

type Props = {
  heading: string;
  lines: readonly string[];
  cta: HowItWorksCta;
};

export function HowItWorksChecklistAside({ heading, lines, cta }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: 0.08 }}
      className="flex flex-col justify-center gap-6"
    >
      <h3 className="font-host-grotesk text-2xl font-medium text-foreground md:text-3xl">
        {heading}
      </h3>
      <ul className="space-y-4">
        {lines.map((line) => (
          <li
            key={line}
            className="flex gap-3 leading-relaxed text-muted-foreground"
          >
            <span
              className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
              aria-hidden
            />
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <div className="pt-2">
        <Button className="h-12 rounded-full px-8 font-semibold" asChild>
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
      </div>
    </m.div>
  );
}
