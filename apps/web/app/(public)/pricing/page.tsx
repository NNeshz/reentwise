import type { Metadata } from "next";
import { PricingHero } from "@/modules/pricing/components/pricing-hero";
import { PricingPlans } from "@/modules/pricing/components/pricing-plans";

export const metadata: Metadata = {
  title: "Precios — Reentwise",
  description:
    "Planes Básico, Pro y Patrón según cuartos administrados. Precios en MXN al mes.",
};

export default function PricingPage() {
  return (
    <div className="flex flex-col bg-background">
      <PricingHero />
      <PricingPlans />
    </div>
  );
}
