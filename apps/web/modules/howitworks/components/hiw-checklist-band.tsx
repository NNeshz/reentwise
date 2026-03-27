"use client";

import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import { Button } from "@reentwise/ui/src/components/button";
import { howItWorksChecklistBandContent } from "../data";

export function HowItWorksChecklistBand() {
  const c = howItWorksChecklistBandContent;

  return (
    <section className="w-full py-20 px-4 bg-card/30 border-y border-border/40">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="relative min-h-[280px] rounded-3xl overflow-hidden border border-border/50"
        >
          <Image
            src={c.image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <p className="text-2xl md:text-3xl font-host-grotesk text-foreground leading-snug text-balance">
              {c.imageCaption}
            </p>
          </div>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.08 }}
          className="flex flex-col justify-center gap-6"
        >
          <h3 className="text-2xl md:text-3xl font-host-grotesk font-medium text-foreground">
            {c.heading}
          </h3>
          <ul className="space-y-4">
            {c.lines.map((line) => (
              <li
                key={line}
                className="flex gap-3 text-muted-foreground leading-relaxed"
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
            <Button className="rounded-full px-8 h-12 font-semibold" asChild>
              <Link href={c.cta.href}>{c.cta.label}</Link>
            </Button>
          </div>
        </m.div>
      </div>
    </section>
  );
}
