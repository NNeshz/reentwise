"use client";

import { m } from "framer-motion";

export function About() {
  return (
    <section className="w-full bg-background py-24 px-4 min-h-[80vh] flex flex-col items-center justify-center">
      {/* Main Animated Statement */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-center text-center">
        <m.h2
          className="text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight text-foreground leading-[1.2]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Profesionaliza la renta de tus propiedades con automatización de
          cobranza por WhatsApp y control total de tus ingresos.
        </m.h2>
      </div>
    </section>
  );
}
