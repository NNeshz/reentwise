"use client";

import Image from "next/image";
import { m } from "framer-motion";
import { NoiseOverlay } from "./noise-overlay";
import type { HowItWorksStep } from "@/modules/howitworks/types/howitworks.types";
import { HIW_STEP_IMAGE_FRAME } from "@/modules/howitworks/lib/howitworks-display";

type Props = {
  step: HowItWorksStep;
};

export function HowItWorksStepRowMedia({ step }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45 }}
      className={HIW_STEP_IMAGE_FRAME}
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
  );
}
