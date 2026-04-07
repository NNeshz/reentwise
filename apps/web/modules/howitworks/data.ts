import {
  IconBrandGoogleFilled,
  IconBuildingCommunity,
  IconCalendarEvent,
  IconMessageCircle,
} from "@tabler/icons-react";
import type {
  HowItWorksChecklistBandContent,
  HowItWorksCtaStripContent,
  HowItWorksHeroContent,
  HowItWorksHighlightsContent,
  HowItWorksIntroContent,
  HowItWorksStep,
} from "@/modules/howitworks/types/howitworks.types";

export type {
  HowItWorksStep,
  HowItWorksHighlight,
  HowItWorksHeroContent,
  HowItWorksIntroContent,
  HowItWorksHighlightsContent,
  HowItWorksChecklistBandContent,
  HowItWorksCtaStripContent,
  HowItWorksCta,
} from "@/modules/howitworks/types/howitworks.types";

/**
 * Contenido estático de marketing: no hay store Zustand ni fetch; la página compone estos datos en render.
 */
export const howItWorksHeroContent = {
  badge: "Proceso en 4 pasos",
  title: "¿Cómo funciona reentwise?",
  description:
    "De la cuenta a los recordatorios: un recorrido claro para que cobres en automático sin perder el control.",
  primaryCta: { label: "Comenzar ahora", href: "/auth" as const },
  secondaryCta: { label: "Volver al inicio", href: "/" as const },
} satisfies HowItWorksHeroContent;

export const howItWorksIntroContent = {
  headline:
    "Piensa en nosotros como el copiloto que nunca olvida una fecha de renta.",
  body:
    "Tú defines la estructura y las fechas; nosotros convertimos eso en recordatorios consistentes por WhatsApp para que la cobranza sea predecible y profesional.",
  tags: ["WhatsApp", "Google Sign-In", "Panel claro"],
} satisfies HowItWorksIntroContent;

export const howItWorksHighlightsContent = {
  sectionBadge: "Resumen del flujo",
  sectionLead:
    "Cada bloque está pensado para que avances sin perder de vista el objetivo: cobrar a tiempo con menos trabajo operativo.",
  items: [
    {
      label: "Menos fricción",
      body: "Un flujo guiado para que configures todo en una sola sentada.",
    },
    {
      label: "Todo centralizado",
      body: "Propiedades, cuartos e inquilinos viven en un solo panel.",
    },
    {
      label: "Siempre a tiempo",
      body: "La fecha de pago dispara recordatorios sin que tú intervengas.",
    },
  ],
} satisfies HowItWorksHighlightsContent;

export const howItWorksSteps: HowItWorksStep[] = [
  {
    id: "01",
    title: "Iniciar sesión con Google",
    description:
      "Crea tu cuenta en segundos con Google. Sin formularios largos ni contraseñas extras que recordar.",
    image: "/images/google.webp",
    imageAlt: "Acceso rápido y seguro",
    icon: IconBrandGoogleFilled,
  },
  {
    id: "02",
    title: "Registrar propiedades y cuartos",
    description:
      "Organiza cada propiedad por unidades o cuartos. Así llevas claridad de qué se renta, a quién y por cuánto.",
    image: "/images/properties.webp",
    imageAlt: "Estructura de propiedades",
    icon: IconBuildingCommunity,
  },
  {
    id: "03",
    title: "Registrar inquilinos y fechas de pago",
    description:
      "Añade a cada inquilino con su ciclo de renta y día de cobro. Nosotros usamos esas fechas para automatizar el seguimiento.",
    image: "/images/tenant.avif",
    imageAlt: "Inquilinos y calendario",
    icon: IconCalendarEvent,
  },
  {
    id: "04",
    title: "Listo: nosotros enviamos recordatorios",
    description:
      "Cuando llegue la fecha, avisamos por WhatsApp con el tono correcto para que cobrar no sea incómodo ni olvidado.",
    image: "/images/done.avif",
    imageAlt: "Recordatorios automáticos",
    icon: IconMessageCircle,
  },
];

export const howItWorksChecklistBandContent = {
  image: "/images/stadistics.avif",
  imageCaption: "Cuatro decisiones. Un sistema que corre solo cada mes.",
  heading: "Lo esencial que activas al configurar",
  lines: [
    "Acceso con Google (OAuth)",
    "Catálogo de propiedades y espacios",
    "Perfiles de inquilino + calendario de renta",
    "Mensajes por WhatsApp en piloto automático",
  ],
  cta: { label: "Ir al registro", href: "/auth" as const },
} satisfies HowItWorksChecklistBandContent;

export const howItWorksCtaStripContent = {
  title: "Empieza hoy y deja que los recordatorios trabajen por ti",
  primaryCta: { label: "Crear cuenta gratis", href: "/auth" as const },
  secondaryCta: { label: "Explorar la landing", href: "/" as const },
} satisfies HowItWorksCtaStripContent;
