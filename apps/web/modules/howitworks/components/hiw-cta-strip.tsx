"use client";

import { howItWorksCtaStripContent } from "@/modules/howitworks/data";
import { HIW_CTA_SECTION } from "@/modules/howitworks/lib/howitworks-display";
import { HowItWorksCtaStripBackground } from "./hiw-cta-strip-background";
import { HowItWorksCtaStripContent } from "./hiw-cta-strip-content";

export function HowItWorksCtaStrip() {
  const c = howItWorksCtaStripContent;

  return (
    <section className={HIW_CTA_SECTION}>
      <HowItWorksCtaStripBackground />
      <HowItWorksCtaStripContent title={c.title} primaryCta={c.primaryCta} />
    </section>
  );
}
