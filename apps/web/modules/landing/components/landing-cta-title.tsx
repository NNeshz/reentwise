"use client";

import { m } from "framer-motion";

type Props = {
  line1: string;
  line2: string;
};

export function LandingCtaTitle({ line1, line2 }: Props) {
  return (
    <m.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="font-host-grotesk mb-10 text-3xl font-normal leading-tighter tracking-tight text-balance text-white md:text-5xl lg:text-6xl"
    >
      {line1}
      <br />
      {line2}
    </m.h2>
  );
}
