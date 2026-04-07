"use client";

import { m } from "framer-motion";

type Props = {
  title: string;
  body: string;
};

export function LandingStadisticsCopy({ title, body }: Props) {
  return (
    <>
      <m.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ delay: 0.1 }}
        className="font-host-grotesk text-4xl font-medium leading-[1.1] tracking-tight text-foreground text-balance md:text-5xl"
      >
        {title}
      </m.h2>

      <m.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ delay: 0.2 }}
        className="text-lg leading-relaxed text-muted-foreground"
      >
        {body}
      </m.p>
    </>
  );
}
