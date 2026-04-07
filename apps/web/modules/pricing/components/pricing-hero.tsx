"use client";

import { pricingHeroContent } from "@/modules/pricing/data";
import { PricingHeroBackground } from "./pricing-hero-background";
import { PricingHeroBadge } from "./pricing-hero-badge";
import { PricingHeroCopy } from "./pricing-hero-copy";

export function PricingHero() {
  const c = pricingHeroContent;

  return (
    <section className="relative flex min-h-[42vh] w-full flex-col justify-end overflow-hidden px-4 pb-16 pt-28 md:min-h-[50vh]">
      <PricingHeroBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-5 text-center">
        <PricingHeroBadge label={c.badge} />
        <PricingHeroCopy title={c.title} description={c.description} />
      </div>
    </section>
  );
}
