import Image from "next/image";
import { NoiseOverlay } from "@/modules/howitworks/components/noise-overlay";

export function AuthBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Image
        src="/images/hero-bg.avif"
        alt="Modern real estate home"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <NoiseOverlay opacityClassName="opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-black/40" />
    </div>
  );
}
