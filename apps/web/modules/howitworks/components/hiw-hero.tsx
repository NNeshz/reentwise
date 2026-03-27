"use client";

import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import { IconRoute } from "@tabler/icons-react";
import { Button } from "@reentwise/ui/src/components/button";
import { NoiseOverlay } from "./noise-overlay";
import { howItWorksHeroContent } from "../data";

export function HowItWorksHero() {
  const c = howItWorksHeroContent;

  return (
    <section className="relative w-full min-h-dvh flex flex-col justify-end pb-20 px-4 pt-28 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hiw.avif"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <NoiseOverlay opacityClassName="opacity-40" />
        <div className="absolute inset-0 bg-black/45 bg-linear-to-t from-black/70 via-black/35 to-black/25 pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center gap-6">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full"
        >
          <IconRoute className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">{c.badge}</span>
        </m.div>

        <m.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-4xl md:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.1] font-host-grotesk text-balance"
        >
          {c.title}
        </m.h1>

        <m.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="text-lg md:text-xl text-white/90 max-w-2xl font-medium text-balance"
        >
          {c.description}
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2"
        >
          <Button
            size="lg"
            className="rounded-full px-8 h-12 font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <Link href={c.primaryCta.href}>{c.primaryCta.label}</Link>
          </Button>
        </m.div>
      </div>
    </section>
  );
}
