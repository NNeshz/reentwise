"use client";

import { m } from "framer-motion";
import type { HowItWorksHighlight } from "@/modules/howitworks/types/howitworks.types";
import { HIW_HIGHLIGHT_CARD_CLASS } from "@/modules/howitworks/lib/howitworks-display";

type Props = {
  item: HowItWorksHighlight;
  index: number;
};

export function HowItWorksHighlightCard({ item, index }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.08 }}
      className={HIW_HIGHLIGHT_CARD_CLASS}
    >
      <span className="text-sm font-semibold text-primary">{item.label}</span>
      <p className="leading-relaxed text-muted-foreground">{item.body}</p>
    </m.div>
  );
}
