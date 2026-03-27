"use client";

import Image from "next/image";
import { m } from "framer-motion";
import { cn } from "@reentwise/ui/src/lib/utils";
import { NoiseOverlay } from "@/modules/howitworks/components/noise-overlay";
import type { Testimonial } from "../data";

type TestimonialRowProps = {
  testimonial: Testimonial;
  index: number;
};

export function TestimonialRow({ testimonial, index }: TestimonialRowProps) {
  const Icon = testimonial.icon;
  const imageOnRight = index % 2 === 0;

  const planAccent =
    testimonial.planId === "pro"
      ? "border-primary/50 bg-primary/10 text-primary"
      : testimonial.planId === "patron"
        ? "border-foreground/20 bg-muted/60 text-foreground"
        : "border-border/80 bg-muted/40 text-muted-foreground";

  const initials = testimonial.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <m.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      className={cn(
        "grid grid-cols-1 gap-10 items-center lg:grid-cols-2 lg:gap-16",
        !imageOnRight && "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1",
        testimonial.planId === "pro" &&
          "rounded-3xl border border-primary/20 bg-card/50 p-6 shadow-sm md:p-10 lg:p-12",
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-6",
          imageOnRight ? "lg:pr-6" : "lg:pl-6",
        )}
      >
        <div className="flex items-center gap-4">
          <span className="font-host-grotesk text-5xl font-medium tabular-nums text-primary/90 md:text-6xl">
            {testimonial.stepIndex}
          </span>
          <div className="h-px max-w-[120px] flex-1 bg-border/60" aria-hidden />
          <div className="flex size-12 items-center justify-center rounded-2xl border border-border/60 bg-card">
            <Icon className="size-6 text-foreground" stroke={1.25} />
          </div>
        </div>

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
            <p className="mt-1 text-sm text-muted-foreground">{testimonial.context}</p>
          </div>
        </div>

        <span
          className={cn(
            "w-fit rounded-full border px-3 py-1 text-xs font-semibold",
            planAccent,
          )}
        >
          {testimonial.planName}
        </span>

        <blockquote className="max-w-xl border-l-2 border-primary/50 pl-5 text-lg leading-relaxed text-muted-foreground">
          “{testimonial.quote}”
        </blockquote>

        <p className="max-w-xl border-t border-border/50 pt-4 text-base font-medium text-foreground">
          {testimonial.highlight}
        </p>
      </div>

      <m.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45 }}
        className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-border/40 shadow-sm"
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
    </m.article>
  );
}
