"use client";

import { m } from "framer-motion";
import type { LandingStatItem } from "@/modules/landing/types/landing.types";
import { landingStatCardClassName } from "@/modules/landing/lib/landing-display";

type Props = {
  item: LandingStatItem;
  index: number;
};

export function LandingStadisticsStatCard({ item, index }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ delay: index * 0.1 }}
      className={landingStatCardClassName()}
    >
      <span className="mb-2 font-host-grotesk text-4xl font-medium text-foreground md:mb-0 md:text-5xl">
        {item.value}
      </span>
      <span className="max-w-[170px] text-sm text-muted-foreground md:text-right md:text-base">
        {item.caption}
      </span>
    </m.div>
  );
}
