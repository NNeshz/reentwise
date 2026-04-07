"use client";

import { m } from "framer-motion";

type Props = {
  line1: string;
  line2: string;
};

export function LandingHeroTitle({ line1, line2 }: Props) {
  return (
    <m.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="font-host-grotesk mb-6 mt-32 text-3xl font-normal leading-tighter tracking-tight text-white md:text-5xl lg:text-6xl"
    >
      {line1}
      <br />
      {line2}
    </m.h1>
  );
}
