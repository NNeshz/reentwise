"use client";

import Image from "next/image";
import { m } from "framer-motion";
import { cn } from "@reentwise/ui/src/lib/utils";
import { NoiseOverlay } from "./noise-overlay";
import type { HowItWorksStep } from "../data";

type HowItWorksStepRowProps = {
  step: HowItWorksStep;
  index: number;
};

export function HowItWorksStepRow({ step, index }: HowItWorksStepRowProps) {
  const Icon = step.icon;
  const imageOnRight = index % 2 === 0;

  return (
    <m.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center",
        !imageOnRight && "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1",
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-6",
          imageOnRight ? "lg:pr-6" : "lg:pl-6",
        )}
      >
        <div className="flex items-center gap-4">
          <span className="text-5xl md:text-6xl font-host-grotesk font-medium text-primary/90 tabular-nums">
            {step.id}
          </span>
          <div className="h-px flex-1 bg-border/60 max-w-[120px]" aria-hidden />
          <div className="flex size-12 items-center justify-center rounded-2xl border border-border/60 bg-card">
            <Icon className="size-6 text-foreground" stroke={1.25} />
          </div>
        </div>
        <h3 className="text-3xl md:text-4xl font-host-grotesk font-medium text-foreground leading-tight text-balance">
          {step.title}
        </h3>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
          {step.description}
        </p>
      </div>

      <m.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45 }}
        className="relative w-full aspect-4/3 overflow-hidden rounded-3xl border border-border/40 shadow-sm"
      >
        <Image
          src={step.image}
          alt={step.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <NoiseOverlay opacityClassName="opacity-25" />
      </m.div>
    </m.article>
  );
}
