"use client";

import Image from "next/image";
import { NoiseOverlay } from "./noise-overlay";

export function HowItWorksCtaStripBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Image
        src="/images/cta.avif"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <NoiseOverlay opacityClassName="opacity-35" />
      <div className="absolute inset-0 bg-black/55" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-background to-transparent" />
    </div>
  );
}
