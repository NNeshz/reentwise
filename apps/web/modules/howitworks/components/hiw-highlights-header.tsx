"use client";

import { m } from "framer-motion";
import { IconSparkles } from "@tabler/icons-react";
import { HIW_HIGHLIGHTS_BADGE_ROW } from "@/modules/howitworks/lib/howitworks-display";

type Props = {
  sectionBadge: string;
  sectionLead: string;
};

export function HowItWorksHighlightsHeader({ sectionBadge, sectionLead }: Props) {
  return (
    <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <m.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className={HIW_HIGHLIGHTS_BADGE_ROW}
      >
        <IconSparkles className="h-4 w-4 text-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          {sectionBadge}
        </span>
      </m.div>
      <m.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-md text-muted-foreground md:text-right"
      >
        {sectionLead}
      </m.p>
    </div>
  );
}
