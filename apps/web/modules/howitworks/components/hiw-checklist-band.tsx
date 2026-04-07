"use client";

import { howItWorksChecklistBandContent } from "@/modules/howitworks/data";
import { HIW_CHECKLIST_GRID, HIW_CHECKLIST_SECTION } from "@/modules/howitworks/lib/howitworks-display";
import { HowItWorksChecklistVisual } from "./hiw-checklist-visual";
import { HowItWorksChecklistAside } from "./hiw-checklist-aside";

export function HowItWorksChecklistBand() {
  const c = howItWorksChecklistBandContent;

  return (
    <section className={HIW_CHECKLIST_SECTION}>
      <div className={HIW_CHECKLIST_GRID}>
        <HowItWorksChecklistVisual
          imageSrc={c.image}
          caption={c.imageCaption}
        />
        <HowItWorksChecklistAside
          heading={c.heading}
          lines={c.lines}
          cta={c.cta}
        />
      </div>
    </section>
  );
}
