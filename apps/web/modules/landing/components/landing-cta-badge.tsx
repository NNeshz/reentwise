"use client";

import { m } from "framer-motion";
import { IconHeart } from "@tabler/icons-react";

type Props = {
  label: string;
};

export function LandingCtaBadge({ label }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md"
    >
      <IconHeart className="h-4 w-4 text-white" />
      <span className="text-sm font-medium text-white">{label}</span>
    </m.div>
  );
}
