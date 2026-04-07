import {
  IconBed,
  IconBuildingCommunity,
  IconBuildingSkyscraper,
} from "@tabler/icons-react";
import type {
  Testimonial,
  TestimonialsHeroContent,
} from "@/modules/testimonials/types/testimonials.types";

export type {
  Testimonial,
  TestimonialPlanId,
  TestimonialsHeroContent,
} from "@/modules/testimonials/types/testimonials.types";

/**
 * Contenido estático de marketing; sin store ni fetch.
 */
export const testimonialsHeroContent = {
  badge: "Historias reales",
  title: "Quienes arriendan cuartos con reentwise",
  description:
    "Propietarios que dividieron su casa o tienen varios espacios: menos perseguir cobros, más claridad cada mes.",
} satisfies TestimonialsHeroContent;

export const testimonials: Testimonial[] = [
  {
    id: "1",
    stepIndex: "01",
    name: "Luz Hernández",
    context: "Arrienda 2 cuartos en una casa en CDMX",
    planId: "basic",
    planName: "Plan Básico",
    quote:
      "Antes tenía que acordarme yo de mandar el mensaje cada mes. Ahora los recordatorios salen solos y el inquilino ya sabe qué onda. Dejé de estar encima del teléfono los domingos.",
    highlight: "Le calculo unas 4 horas al mes que ya no pierdo en cobros.",
    image: "/images/properties.webp",
    imageAlt: "Espacios y cuartos en renta",
    icon: IconBed,
  },
  {
    id: "2",
    stepIndex: "02",
    name: "Marco Rivas",
    context: "8 cuartos repartidos en dos propiedades",
    planId: "pro",
    planName: "Plan Pro",
    quote:
      "Con varios inquilinos el caos era normal: quién pagó, quién no, a quién le tocaba recordatorio. El panel y las reglas me dejaron ver todo en un solo lugar; los de WhatsApp ya no son el desorden de antes.",
    highlight:
      "Menos idas y vueltas: recuperé tiempo para el trabajo, no para cobrar.",
    image: "/images/tenant.avif",
    imageAlt: "Inquilinos y operación",
    icon: IconBuildingCommunity,
  },
  {
    id: "3",
    stepIndex: "03",
    name: "Andrea Méndez",
    context: "Administra más de 20 cuartos entre varias ubicaciones",
    planId: "patron",
    planName: "Plan Patrón",
    quote:
      "A escala grande, un día de retraso se multiplica. Priorizar envíos y tener reportes claros me ayudó a no estar apagando incendios cada quincena. Sigo revisando, pero ya no es urgencia 24/7.",
    highlight: "La operación dejó de depender de mi bandeja de WhatsApp.",
    image: "/images/done.avif",
    imageAlt: "Operación a escala",
    icon: IconBuildingSkyscraper,
  },
];
