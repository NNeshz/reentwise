"use client";

import { m } from "framer-motion";

type Props = {
  text: string;
};

export function LandingHeroDescription({ text }: Props) {
  return (
    <m.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="mb-10 max-w-2xl text-balance font-medium text-white/90 md:text-lg"
    >
      {text}
    </m.p>
  );
}
