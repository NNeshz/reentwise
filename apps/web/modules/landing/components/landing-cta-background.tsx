"use client";

import Image from "next/image";
import { NoiseOverlay } from "@/modules/howitworks/components/noise-overlay";

export function LandingCtaBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Image
        src="/images/cta.avif"
        alt="Modern real estate home"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <NoiseOverlay opacityClassName="opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-black/20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-background to-transparent" />
    </div>
  );
}
