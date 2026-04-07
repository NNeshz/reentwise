"use client";

import { landingHeroContent } from "@/modules/landing/data";
import { LANDING_HERO_SECTION } from "@/modules/landing/lib/landing-display";
import { LandingHeroBackground } from "./landing-hero-background";
import { LandingHeroTitle } from "./landing-hero-title";
import { LandingHeroDescription } from "./landing-hero-description";
import { LandingHeroActions } from "./landing-hero-actions";

export function Hero() {
  const c = landingHeroContent;

  return (
    <section className={LANDING_HERO_SECTION}>
      <LandingHeroBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center text-center">
        <LandingHeroTitle line1={c.titleLine1} line2={c.titleLine2} />
        <LandingHeroDescription text={c.description} />
        <LandingHeroActions
          primaryCta={c.primaryCta}
          secondaryCta={c.secondaryCta}
        />
      </div>
    </section>
  );
}
