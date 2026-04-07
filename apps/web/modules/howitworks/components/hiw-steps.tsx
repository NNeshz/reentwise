"use client";

import type { HowItWorksStep } from "@/modules/howitworks/types/howitworks.types";
import { howItWorksSteps } from "@/modules/howitworks/data";
import { HIW_SECTION, HIW_STEPS_STACK } from "@/modules/howitworks/lib/howitworks-display";
import { HowItWorksStepRow } from "./hiw-step-row";

type HowItWorksStepsProps = {
  steps?: HowItWorksStep[];
};

export function HowItWorksSteps({ steps = howItWorksSteps }: HowItWorksStepsProps) {
  return (
    <section className={HIW_SECTION}>
      <div className={HIW_STEPS_STACK}>
        {steps.map((step, index) => (
          <HowItWorksStepRow key={step.id} step={step} index={index} />
        ))}
      </div>
    </section>
  );
}
