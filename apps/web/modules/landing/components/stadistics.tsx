"use client";

import Image from "next/image";
import { Button } from "@reentwise/ui/src/components/button";
import { motion } from "framer-motion";
import { IconCrown } from "@tabler/icons-react";

export function Stadistics() {
  return (
    <section className="w-full bg-background py-24 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl mx-auto space-y-12">
        {/* Top Section: Text and Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="flex flex-col items-start text-left space-y-6 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              className="inline-flex items-center gap-2 border border-border/50 bg-background px-3 py-1.5 rounded-full shadow-sm"
            >
              <IconCrown className="w-4 h-4 text-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Automatización
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-host-grotesk font-medium tracking-tight text-foreground leading-[1.1] text-balance"
            >
              Recupera tu tiempo y garantiza el pago puntual de tus rentas
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              Nuestra plataforma se encarga del trabajo manual. Notificamos a
              tus inquilinos, conciliamos los pagos y brindamos recibos
              automáticamente.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full px-8 text-base font-semibold h-12"
              >
                Comenzar
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-full px-8 text-base font-semibold h-12"
              >
                Agendar demo
              </Button>
            </motion.div>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="relative w-full aspect-4/3 lg:aspect-square overflow-hidden rounded-3xl"
          >
            <Image
              src="/images/stadistics.avif"
              alt="Premium real estate interior"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </div>

        {/* Bottom Section: Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            className="flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 border border-border/50 rounded-2xl shadow-sm bg-card"
          >
            <span className="text-4xl md:text-5xl font-host-grotesk font-medium text-foreground mb-2 md:mb-0">
              10,000+
            </span>
            <span className="text-sm md:text-base text-muted-foreground md:text-right max-w-[170px]">
              Rentas cobradas exitosamente
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 border border-border/50 rounded-2xl shadow-sm bg-card"
          >
            <span className="text-4xl md:text-5xl font-host-grotesk font-medium text-foreground mb-2 md:mb-0">
              98%
            </span>
            <span className="text-sm md:text-base text-muted-foreground md:text-right max-w-[170px]">
              Tasa de pago puntual lograda
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 border border-border/50 rounded-2xl shadow-sm bg-card"
          >
            <span className="text-4xl md:text-5xl font-host-grotesk font-medium text-foreground mb-2 md:mb-0">
              +40hrs
            </span>
            <span className="text-sm md:text-base text-muted-foreground md:text-right max-w-[170px]">
              Ahorradas al mes por usuario
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 border border-border/50 rounded-2xl shadow-sm bg-card"
          >
            <span className="text-4xl md:text-5xl font-host-grotesk font-medium text-foreground mb-2 md:mb-0">
              500+
            </span>
            <span className="text-sm md:text-base text-muted-foreground md:text-right max-w-[170px]">
              Propietarios felices
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
