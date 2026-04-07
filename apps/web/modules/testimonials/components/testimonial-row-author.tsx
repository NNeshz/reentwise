"use client";

import { cn } from "@reentwise/ui/src/lib/utils";
import type { Testimonial } from "@/modules/testimonials/types/testimonials.types";
import { testimonialPlanBadgeClassName } from "@/modules/testimonials/lib/testimonials-display";

type Props = {
  testimonial: Testimonial;
};

function initialsFromName(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TestimonialRowAuthor({ testimonial }: Props) {
  const initials = initialsFromName(testimonial.name);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex size-14 shrink-0 items-center justify-center rounded-full border border-border/50 bg-background font-host-grotesk text-base font-semibold text-foreground"
          aria-hidden
        >
          {initials}
        </div>
        <div>
          <h2 className="font-host-grotesk text-3xl font-medium leading-tight text-foreground text-balance md:text-4xl">
            {testimonial.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {testimonial.context}
          </p>
        </div>
      </div>

      <span
        className={cn(
          "w-fit rounded-full border px-3 py-1 text-xs font-semibold",
          testimonialPlanBadgeClassName(testimonial.planId),
        )}
      >
        {testimonial.planName}
      </span>
    </>
  );
}
