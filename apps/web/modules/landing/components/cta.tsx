"use client";

import { landingCtaContent } from "@/modules/landing/data";
import { LANDING_CTA_SECTION } from "@/modules/landing/lib/landing-display";
import { LandingCtaBackground } from "./landing-cta-background";
import { LandingCtaBadge } from "./landing-cta-badge";
import { LandingCtaTitle } from "./landing-cta-title";
import { LandingCtaActions } from "./landing-cta-actions";

export function Cta() {
  const c = landingCtaContent;

  return (
    <section className={LANDING_CTA_SECTION}>
      <LandingCtaBackground />
      <div className="relative z-10 mx-auto mt-20 flex w-full max-w-4xl flex-col items-center justify-center text-center">
        <LandingCtaBadge label={c.badgeLabel} />
        <LandingCtaTitle line1={c.titleLine1} line2={c.titleLine2} />
        <LandingCtaActions
          primaryCta={c.primaryCta}
          secondaryCta={c.secondaryCta}
        />
      </div>
    </section>
  );
}
