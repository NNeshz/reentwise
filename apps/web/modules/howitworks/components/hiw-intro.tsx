"use client";

import { howItWorksIntroContent } from "@/modules/howitworks/data";
import { HIW_INTRO_GRID, HIW_SECTION } from "@/modules/howitworks/lib/howitworks-display";
import { HowItWorksIntroHeadline } from "./hiw-intro-headline";
import { HowItWorksIntroAside } from "./hiw-intro-aside";

export function HowItWorksIntro() {
  const { headline, body, tags } = howItWorksIntroContent;

  return (
    <section className={HIW_SECTION}>
      <div className={HIW_INTRO_GRID}>
        <HowItWorksIntroHeadline headline={headline} />
        <HowItWorksIntroAside body={body} tags={tags} />
      </div>
    </section>
  );
}
