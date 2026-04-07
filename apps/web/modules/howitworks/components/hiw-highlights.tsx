"use client";

import { howItWorksHighlightsContent } from "@/modules/howitworks/data";
import {
  HIW_CONTAINER,
  HIW_HIGHLIGHTS_GRID,
  HIW_SECTION,
} from "@/modules/howitworks/lib/howitworks-display";
import { HowItWorksHighlightsHeader } from "./hiw-highlights-header";
import { HowItWorksHighlightCard } from "./hiw-highlight-card";

export function HowItWorksHighlights() {
  const { sectionBadge, sectionLead, items } = howItWorksHighlightsContent;

  return (
    <section className={HIW_SECTION}>
      <div className={HIW_CONTAINER}>
        <HowItWorksHighlightsHeader
          sectionBadge={sectionBadge}
          sectionLead={sectionLead}
        />
        <div className={HIW_HIGHLIGHTS_GRID}>
          {items.map((item, i) => (
            <HowItWorksHighlightCard key={item.label} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
