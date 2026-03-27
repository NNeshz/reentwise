"use client";

import Image from "next/image";
import { m } from "framer-motion";
import { IconCoin } from "@tabler/icons-react";
import { NoiseOverlay } from "@/modules/howitworks/components/noise-overlay";
import { pricingHeroContent } from "../data";

export function PricingHero() {
  const c = pricingHeroContent;

  return (
    <section className="relative flex min-h-[42vh] w-full flex-col justify-end overflow-hidden px-4 pb-16 pt-28 md:min-h-[50vh]">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.avif"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <NoiseOverlay opacityClassName="opacity-40" />
        <div className="pointer-events-none absolute inset-0 bg-black/45 bg-linear-to-t from-black/70 via-black/35 to-black/25" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-5 text-center">
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md"
        >
          <IconCoin className="size-4 text-white" stroke={1.25} />
          <span className="text-sm font-medium text-white">{c.badge}</span>
        </m.div>

        <m.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="font-host-grotesk text-4xl font-normal leading-[1.1] tracking-tight text-white text-balance md:text-5xl lg:text-6xl"
        >
          {c.title}
        </m.h1>

        <m.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-xl text-lg font-medium text-white/90 text-balance"
        >
          {c.description}
        </m.p>
      </div>
    </section>
  );
}
