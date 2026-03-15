"use client";

import Image from "next/image";
import { Button } from "@reentwise/ui/src/components/button";
import { motion } from "framer-motion";
import { IconHeart } from "@tabler/icons-react";

export function Cta() {
  return (
    <section className="relative w-full h-[65vh] min-h-[600px] flex flex-col justify-end pb-24 px-4 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cta.avif"
          alt="Modern real estate home"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Subtle Noise Overlay */}
        <div
          className="absolute inset-0 mix-blend-overlay pointer-events-none opacity-40"
          style={{
            backgroundImage: 'url("/images/noise.webp")',
            backgroundRepeat: "repeat",
          }}
        />
        {/* Dark overlay for better text readability and fading into footer */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-background to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center mt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          className="inline-flex items-center gap-2 border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6"
        >
          <IconHeart className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">Empieza hoy</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-3xl md:text-5xl lg:text-6xl font-normal text-white tracking-tight mb-10 leading-tighter font-host-grotesk text-balance"
        >
          ¿Listo para cobrar
          <br />
          tus rentas a tiempo?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Button
            size="lg"
            className="w-full sm:w-auto rounded-full px-8 text-lg font-semibold h-14 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Crear cuenta gratis
          </Button>
          <Button
            size="lg"
            className="w-full sm:w-auto rounded-full px-8 text-lg font-semibold h-14 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-transparent"
          >
            Ver demo
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
