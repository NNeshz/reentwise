"use client";

import Image from "next/image";
import { Button } from "@reentwise/ui/src/components/button";
import { m } from "framer-motion";

export function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex flex-col justify-end pb-24 px-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.avif"
          alt="Modern real estate home"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 mix-blend-overlay pointer-events-none opacity-40"
          style={{
            backgroundImage: 'url("/images/noise.webp")',
            backgroundRepeat: "repeat",
          }}
        />
        <div className="absolute inset-0 bg-black/20 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        <m.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl md:text-5xl lg:text-6xl font-normal text-white tracking-tight mb-6 mt-32 leading-tighter font-host-grotesk"
        >
          Gestiona tus rentas
          <br />
          en piloto automático
        </m.h1>

        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className=" md:text-lg text-white/90 max-w-2xl mb-10 font-medium text-balance"
        >
          reentwise se encarga de los recordatorios de pago y recibos por WhatsApp
          para que tú solo te preocupes por ver crecer tu patrimonio.
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Button
            size="lg"
            className="w-full sm:w-auto rounded-full px-8 text-lg font-semibold h-14 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Comenzar ahora
          </Button>
          <Button
            size="lg"
            className="w-full sm:w-auto rounded-full px-8 text-lg font-semibold h-14 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md"
          >
            Ver como funciona
          </Button>
        </m.div>
      </div>
    </section>
  );
}
