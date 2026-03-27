"use client";

import { m } from "framer-motion";
import { IconVectorBezier2 } from "@tabler/icons-react";
import { Badge } from "@reentwise/ui/src/components/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@reentwise/ui/src/components/accordion";

const approaches = [
  {
    id: "01",
    title: "Cobranza por WhatsApp",
    description:
      "Enviamos recordatorios amistosos a tus inquilinos antes, durante y después de su fecha límite, asegurando un canal de comunicación directo y efectivo.",
    tags: ["Automatizado", "Amigable", "Alta tasa de apertura", "Efectivo"],
  },
  {
    id: "02",
    title: "Conciliación automática",
    description:
      "Olvídate de revisar transferencias manualmente. Nuestro sistema detecta cuando el inquilino ha pagado y actualiza el estado de la renta en tiempo real.",
    tags: ["En tiempo real", "Cero errores", "Sin fricciones"],
  },
  {
    id: "03",
    title: "Emisión de recibos",
    description:
      "Una vez que se confirma el pago, generamos y enviamos un recibo digital válido a tu inquilino de manera automática.",
    tags: ["Profesional", "Descargable", "Historial limpio"],
  },
  {
    id: "04",
    title: "Panel de control",
    description:
      "Visualiza el estado de todas tus propiedades en un solo lugar. Identifica rápidamente quién debe y quién ya pagó desde cualquier dispositivo.",
    tags: ["Métricas globales", "Multi-dispositivo", "Intuitivo"],
  },
];

export function Faq() {
  return (
    <section
      id="services"
      className="w-full bg-background py-24 px-4 flex flex-col items-center justify-center"
    >
      <div className="w-full max-w-6xl mx-auto space-y-16">
        {/* Top Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col items-start space-y-6 max-w-xl">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              className="inline-flex items-center gap-2 border border-border/50 bg-background px-3 py-1.5 rounded-full shadow-sm"
            >
              <IconVectorBezier2 className="w-4 h-4 text-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Funcionalidades principales
              </span>
            </m.div>

            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-host-grotesk font-medium tracking-tight text-foreground leading-[1.1] text-balance"
            >
              Todo lo que necesitas para cobrar tus rentas sin estrés
            </m.h2>
          </div>

          <div className="flex flex-col items-start lg:items-end justify-center h-full space-y-6">
            <m.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed lg:text-right max-w-sm"
            >
              Herramientas diseñadas para que los propietarios y administradores
              tengan control absoluto de su tiempo e ingresos.
            </m.p>

            <m.button
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.3 }}
              className="rounded-full bg-primary text-primary-foreground px-8 py-3 text-base font-semibold hover:bg-primary/90 transition-colors"
            >
              Comenzar gratis
            </m.button>
          </div>
        </div>

        {/* Accordion Section */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          {/* Using type="single" ensures only one item can be open at a time */}
          <Accordion type="single" collapsible className="w-full space-y-4">
            {approaches.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border border-border/50 rounded-2xl bg-card px-6 sm:px-10 overflow-hidden shadow-sm data-[state=open]:pb-6"
              >
                <AccordionTrigger className="hover:no-underline py-8">
                  <div className="flex items-center gap-8 md:gap-16">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {item.id}
                    </span>
                    <span className="text-2xl md:text-3xl font-host-grotesk font-medium text-foreground">
                      {item.title}
                    </span>
                  </div>
                </AccordionTrigger>

                {/* Content Layout (No Image as requested) */}
                <AccordionContent className="pt-2 text-base text-muted-foreground pl-0 md:pl-26">
                  <div className="flex flex-col xl:flex-row gap-8 xl:gap-16">
                    {/* Description */}
                    <div className="max-w-md">
                      <p className="leading-relaxed">{item.description}</p>
                    </div>

                    {/* Tags / Strategy Pillars */}
                    <div className="flex-1 flex flex-col items-start border-t xl:border-t-0 xl:border-l border-border/50 pt-6 xl:pt-0 xl:pl-10">
                      <h4 className="text-foreground font-semibold mb-4">
                        Strategy pillars
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="rounded-full px-4 py-1.5 text-xs text-muted-foreground font-normal border-border/60 hover:bg-transparent"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </m.div>
      </div>
    </section>
  );
}
