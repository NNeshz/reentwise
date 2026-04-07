"use client";

import type { Testimonial } from "@/modules/testimonials/types/testimonials.types";

type Props = {
  testimonial: Testimonial;
};

export function TestimonialRowQuote({ testimonial }: Props) {
  return (
    <>
      <blockquote className="max-w-xl border-l-2 border-primary/50 pl-5 text-lg leading-relaxed text-muted-foreground">
        “{testimonial.quote}”
      </blockquote>

      <p className="max-w-xl border-t border-border/50 pt-4 text-base font-medium text-foreground">
        {testimonial.highlight}
      </p>
    </>
  );
}
