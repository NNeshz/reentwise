"use client";

import Image from "next/image";
import { m } from "framer-motion";

type Props = {
  imageSrc: string;
  caption: string;
};

export function HowItWorksChecklistVisual({ imageSrc, caption }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="relative min-h-[280px] overflow-hidden rounded-3xl border border-border/50"
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <p className="font-host-grotesk text-2xl leading-snug text-foreground text-balance md:text-3xl">
          {caption}
        </p>
      </div>
    </m.div>
  );
}
