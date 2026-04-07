"use client";

import { m } from "framer-motion";

type Props = {
  text: string;
};

export function LandingAboutStatement({ text }: Props) {
  return (
    <m.h2
      className="text-3xl font-normal leading-[1.2] tracking-tight text-foreground md:text-4xl lg:text-5xl"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {text}
    </m.h2>
  );
}
