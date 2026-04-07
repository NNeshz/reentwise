"use client";

import type { Testimonial } from "@/modules/testimonials/types/testimonials.types";

type Props = {
  testimonial: Testimonial;
};

export function TestimonialRowHeader({ testimonial }: Props) {
  const Icon = testimonial.icon;

  return (
    <div className="flex items-center gap-4">
      <span className="font-host-grotesk text-5xl font-medium tabular-nums text-primary/90 md:text-6xl">
        {testimonial.stepIndex}
      </span>
      <div className="h-px max-w-[120px] flex-1 bg-border/60" aria-hidden />
      <div className="flex size-12 items-center justify-center rounded-2xl border border-border/60 bg-card">
        <Icon className="size-6 text-foreground" stroke={1.25} />
      </div>
    </div>
  );
}
