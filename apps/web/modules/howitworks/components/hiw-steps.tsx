"use client";

import type { HowItWorksStep } from "../data";
import { howItWorksSteps } from "../data";
import { HowItWorksStepRow } from "./hiw-step-row";

type HowItWorksStepsProps = {
  steps?: HowItWorksStep[];
};

export function HowItWorksSteps({ steps = howItWorksSteps }: HowItWorksStepsProps) {
  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-24 md:space-y-32">
        {steps.map((step, index) => (
          <HowItWorksStepRow key={step.id} step={step} index={index} />
        ))}
      </div>
    </section>
  );
}
