"use client";

import Image from "next/image";
import { NoiseOverlay } from "@/modules/howitworks/components/noise-overlay";

export function PricingHeroBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Image
        src="/images/hero-bg.avif"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <NoiseOverlay opacityClassName="opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-black/45 bg-linear-to-t from-black/70 via-black/35 to-black/25" />
    </div>
  );
}
