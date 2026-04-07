"use client";

import {
  landingFaqApproaches,
  landingFaqHeaderContent,
} from "@/modules/landing/data";
import {
  LANDING_CONTAINER,
  LANDING_FAQ_SECTION_ID,
  LANDING_SECTION,
} from "@/modules/landing/lib/landing-display";
import { LandingFaqHeader } from "./landing-faq-header";
import { LandingFaqAccordion } from "./landing-faq-accordion";

export function Faq() {
  const h = landingFaqHeaderContent;

  return (
    <section
      id={LANDING_FAQ_SECTION_ID}
      className={`${LANDING_SECTION} flex flex-col items-center justify-center`}
    >
      <div className={`${LANDING_CONTAINER} space-y-16`}>
        <LandingFaqHeader
          badgeLabel={h.badgeLabel}
          title={h.title}
          lead={h.lead}
          cta={h.cta}
        />
        <LandingFaqAccordion items={landingFaqApproaches} />
      </div>
    </section>
  );
}
