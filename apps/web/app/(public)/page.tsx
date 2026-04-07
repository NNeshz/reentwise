import type { Metadata } from "next";
import { About, Cta, Faq, Hero, Stadistics } from "@/modules/landing";

export const metadata: Metadata = {
  title: "Reentwise — Gestiona tus rentas en piloto automático",
  description:
    "Automatiza la cobranza de rentas por WhatsApp. Recordatorios, conciliación y recibos sin esfuerzo.",
};

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <About />
      <Stadistics />
      <Faq />
      <Cta />
    </div>
  );
}
