"use client";

import { m } from "framer-motion";
import { IconQuote } from "@tabler/icons-react";

type Props = {
  label: string;
};

export function TestimonialsHeroBadge({ label }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md"
    >
      <IconQuote className="size-4 text-white" stroke={1.25} />
      <span className="text-sm font-medium text-white">{label}</span>
    </m.div>
  );
}
