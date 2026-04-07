"use client";

import { m } from "framer-motion";
import { IconRoute } from "@tabler/icons-react";

type Props = {
  label: string;
};

export function HowItWorksHeroBadge({ label }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md"
    >
      <IconRoute className="h-4 w-4 text-white" />
      <span className="text-sm font-medium text-white">{label}</span>
    </m.div>
  );
}
