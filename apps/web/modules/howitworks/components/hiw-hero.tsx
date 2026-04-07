"use client";

import { howItWorksHeroContent } from "@/modules/howitworks/data";
import { HIW_HERO_SECTION } from "@/modules/howitworks/lib/howitworks-display";
import { HowItWorksHeroBackground } from "./hiw-hero-background";
import { HowItWorksHeroBadge } from "./hiw-hero-badge";
import { HowItWorksHeroCopy } from "./hiw-hero-copy";
import { HowItWorksHeroActions } from "./hiw-hero-actions";

export function HowItWorksHero() {
  const c = howItWorksHeroContent;

  return (
    <section className={HIW_HERO_SECTION}>
      <HowItWorksHeroBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-6 text-center">
        <HowItWorksHeroBadge label={c.badge} />
        <HowItWorksHeroCopy title={c.title} description={c.description} />
        <HowItWorksHeroActions primaryCta={c.primaryCta} />
      </div>
    </section>
  );
}
