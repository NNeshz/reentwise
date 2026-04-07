"use client";

import { m } from "framer-motion";

type Props = {
  title: string;
  description: string;
};

export function HowItWorksHeroCopy({ title, description }: Props) {
  return (
    <>
      <m.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="font-host-grotesk text-4xl font-normal leading-[1.1] tracking-tight text-white text-balance md:text-5xl lg:text-6xl"
      >
        {title}
      </m.h1>

      <m.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.12 }}
        className="max-w-2xl text-lg font-medium text-white/90 text-balance md:text-xl"
      >
        {description}
      </m.p>
    </>
  );
}
