"use client";

import type { HowItWorksStep } from "@/modules/howitworks/types/howitworks.types";

type Props = {
  step: HowItWorksStep;
};

export function HowItWorksStepRowCopy({ step }: Props) {
  return (
    <>
      <h3 className="font-host-grotesk text-3xl font-medium leading-tight text-foreground text-balance md:text-4xl">
        {step.title}
      </h3>
      <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
        {step.description}
      </p>
    </>
  );
}
