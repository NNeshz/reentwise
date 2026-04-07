"use client";

import { m } from "framer-motion";

type Props = {
  headline: string;
};

export function HowItWorksIntroHeadline({ headline }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      className="lg:col-span-7"
    >
      <h2 className="font-host-grotesk text-3xl font-medium leading-[1.15] text-foreground text-balance md:text-4xl lg:text-5xl">
        {headline}
      </h2>
    </m.div>
  );
}
