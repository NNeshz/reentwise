import {
  HowItWorksCtaStrip,
  HowItWorksHero,
  HowItWorksHighlights,
  HowItWorksIntro,
  HowItWorksSteps,
} from "@/modules/howitworks";
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
