import type { Metadata } from "next";
import { TestimonialsHero, TestimonialsRows } from "@/modules/testimonials";

export const metadata: Metadata = {
  title: "Testimonios — Reentwise",
  description:
    "Propietarios que arriendan cuartos con reentwise: planes Básico, Pro y Patrón, menos tiempo cobrando y más claridad.",
};

export default function TestimonialsPage() {
  return (
    <div className="flex flex-col bg-background">
      <TestimonialsHero />
      <TestimonialsRows />
    </div>
  );
}
