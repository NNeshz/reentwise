"use client";

import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import { Button } from "@reentwise/ui/src/components/button";
import { NoiseOverlay } from "./noise-overlay";
import { howItWorksCtaStripContent } from "../data";

export function HowItWorksCtaStrip() {
  const c = howItWorksCtaStripContent;

  return (
    <section className="relative w-full min-h-[50dvh] flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cta.avif"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <NoiseOverlay opacityClassName="opacity-35" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-background to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-3xl md:text-5xl font-host-grotesk font-normal text-white leading-tight text-balance"
        >
          {c.title}
        </m.h2>
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.08 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="rounded-full px-8 h-14 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <Link href={c.primaryCta.href}>{c.primaryCta.label}</Link>
          </Button>
        </m.div>
      </div>
    </section>
  );
}
