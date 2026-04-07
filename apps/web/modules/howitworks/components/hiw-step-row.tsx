"use client";

import { m } from "framer-motion";
import { cn } from "@reentwise/ui/src/lib/utils";
import type { HowItWorksStep } from "@/modules/howitworks/types/howitworks.types";
import { hiwStepRowOrderClass } from "@/modules/howitworks/lib/howitworks-display";
import { HowItWorksStepRowHeader } from "./hiw-step-row-header";
import { HowItWorksStepRowCopy } from "./hiw-step-row-copy";
import { HowItWorksStepRowMedia } from "./hiw-step-row-media";

type HowItWorksStepRowProps = {
  step: HowItWorksStep;
  index: number;
};

export function HowItWorksStepRow({ step, index }: HowItWorksStepRowProps) {
  const imageOnRight = index % 2 === 0;

  return (
    <m.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      className={hiwStepRowOrderClass(imageOnRight)}
    >
      <div
        className={cn(
          "flex flex-col gap-6",
          imageOnRight ? "lg:pr-6" : "lg:pl-6",
        )}
      >
        <HowItWorksStepRowHeader step={step} />
        <HowItWorksStepRowCopy step={step} />
      </div>

      <HowItWorksStepRowMedia step={step} />
    </m.article>
  );
}
