"use client";

import type { HowItWorksStep } from "@/modules/howitworks/types/howitworks.types";

type Props = {
  step: HowItWorksStep;
};

export function HowItWorksStepRowHeader({ step }: Props) {
  const Icon = step.icon;

  return (
    <div className="flex items-center gap-4">
      <span className="font-host-grotesk text-5xl font-medium tabular-nums text-primary/90 md:text-6xl">
        {step.id}
      </span>
      <div className="h-px max-w-[120px] flex-1 bg-border/60" aria-hidden />
      <div className="flex size-12 items-center justify-center rounded-2xl border border-border/60 bg-card">
        <Icon className="size-6 text-foreground" stroke={1.25} />
      </div>
    </div>
  );
}
