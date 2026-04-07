"use client";

import { m } from "framer-motion";
import { cn } from "@reentwise/ui/src/lib/utils";
import type { Testimonial } from "@/modules/testimonials/types/testimonials.types";
import { testimonialRowGridClassName } from "@/modules/testimonials/lib/testimonials-display";
import { TestimonialRowHeader } from "./testimonial-row-header";
import { TestimonialRowAuthor } from "./testimonial-row-author";
import { TestimonialRowQuote } from "./testimonial-row-quote";
import { TestimonialRowMedia } from "./testimonial-row-media";

type TestimonialRowProps = {
  testimonial: Testimonial;
  index: number;
};

export function TestimonialRow({ testimonial, index }: TestimonialRowProps) {
  const imageOnRight = index % 2 === 0;
  const isProFeatured = testimonial.planId === "pro";

  return (
    <m.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      className={testimonialRowGridClassName(imageOnRight, isProFeatured)}
    >
      <div
        className={cn(
          "flex flex-col gap-6",
          imageOnRight ? "lg:pr-6" : "lg:pl-6",
        )}
      >
        <TestimonialRowHeader testimonial={testimonial} />
        <TestimonialRowAuthor testimonial={testimonial} />
        <TestimonialRowQuote testimonial={testimonial} />
      </div>

      <TestimonialRowMedia testimonial={testimonial} />
    </m.article>
  );
}
