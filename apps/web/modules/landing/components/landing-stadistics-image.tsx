"use client";

import Image from "next/image";
import { m } from "framer-motion";

type Props = {
  src: string;
  alt: string;
};

export function LandingStadisticsImage({ src, alt }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="relative aspect-4/3 w-full overflow-hidden rounded-3xl lg:aspect-square"
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </m.div>
  );
}
