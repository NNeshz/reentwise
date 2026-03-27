import { HowItWorksHero } from "@/modules/howitworks/components/hiw-hero";
import { HowItWorksIntro } from "@/modules/howitworks/components/hiw-intro";
import { HowItWorksHighlights } from "@/modules/howitworks/components/hiw-highlights";
import { HowItWorksSteps } from "@/modules/howitworks/components/hiw-steps";
import { HowItWorksChecklistBand } from "@/modules/howitworks/components/hiw-checklist-band";
import { HowItWorksCtaStrip } from "@/modules/howitworks/components/hiw-cta-strip";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "¿Cómo funciona? — Reentwise",
  description:
    "Pasos para iniciar sesión con Google, registrar propiedades e inquilinos, y automatizar recordatorios de renta por WhatsApp.",
};

export default function HowItWorksPage() {
  return (
    <div>
      <HowItWorksHero />
      <HowItWorksIntro />
      <HowItWorksHighlights />
      <HowItWorksSteps />
      <HowItWorksCtaStrip />
    </div>
  );
}
