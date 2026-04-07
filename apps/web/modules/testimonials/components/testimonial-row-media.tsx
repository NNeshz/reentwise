"use client";

import Image from "next/image";
import { m } from "framer-motion";
import { NoiseOverlay } from "@/modules/howitworks/components/noise-overlay";
import type { Testimonial } from "@/modules/testimonials/types/testimonials.types";
import { testimonialImageFrameClassName } from "@/modules/testimonials/lib/testimonials-display";

type Props = {
  testimonial: Testimonial;
};

export function TestimonialRowMedia({ testimonial }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45 }}
      className={testimonialImageFrameClassName()}
    >
      <Image
        src={testimonial.image}
        alt={testimonial.imageAlt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <NoiseOverlay opacityClassName="opacity-25" />
    </m.div>
  );
}
