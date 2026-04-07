"use client";

import { m } from "framer-motion";
import { IconCrown } from "@tabler/icons-react";

type Props = {
  label: string;
};

export function LandingStadisticsBadge({ label }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background px-3 py-1.5 shadow-sm"
    >
      <IconCrown className="h-4 w-4 text-foreground" />
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </m.div>
  );
}
