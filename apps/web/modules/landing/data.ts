import type {
  LandingCta,
  LandingFaqApproach,
  LandingFooterColumn,
  LandingNavLink,
  LandingStatItem,
} from "@/modules/landing/types/landing.types";

export type {
  LandingNavLink,
  LandingCta,
  LandingStatItem,
  LandingFaqApproach,
  LandingFooterColumn,
  LandingFooterLink,
} from "@/modules/landing/types/landing.types";

/**
 * Marketing estático: sin fetch ni Zustand; CTAs y enlaces viven aquí para un solo lugar de verdad.
 */
export const landingNavLinks: LandingNavLink[] = [
  { name: "Cómo funciona", href: "/howitworks" },
  { name: "Testimonios", href: "/testimonials" },
  { name: "Precios", href: "/pricing" },
];

export const landingHeroContent = {
  titleLine1: "Gestiona tus rentas",
  titleLine2: "en piloto automático",
  description:
    "reentwise se encarga de los recordatorios de pago y recibos por WhatsApp para que tú solo te preocupes por ver crecer tu patrimonio.",
  primaryCta: { label: "Comenzar ahora", href: "/auth" } satisfies LandingCta,
  secondaryCta: { label: "Ver como funciona", href: "/howitworks" } satisfies LandingCta,
} as const;

export const landingAboutContent = {
  statement:
    "Profesionaliza la renta de tus propiedades con automatización de cobranza por WhatsApp y control total de tus ingresos.",
} as const;

export const landingStadisticsContent = {
  badgeLabel: "Automatización",
  title: "Recupera tu tiempo y garantiza el pago puntual de tus rentas",
  body:
    "Nuestra plataforma se encarga del trabajo manual. Notificamos a tus inquilinos, conciliamos los pagos y brindamos recibos automáticamente.",
  primaryCta: { label: "Comenzar", href: "/auth" } satisfies LandingCta,
  secondaryCta: { label: "Agendar demo", href: "/howitworks" } satisfies LandingCta,
  imageSrc: "/images/stadistics.avif",
  imageAlt: "Interior inmobiliario premium",
} as const;

export const landingStadisticsStats: LandingStatItem[] = [
  { value: "10,000+", caption: "Rentas cobradas exitosamente" },
  { value: "98%", caption: "Tasa de pago puntual lograda" },
  { value: "+40hrs", caption: "Ahorradas al mes por usuario" },
  { value: "500+", caption: "Propietarios felices" },
];

export const landingFaqHeaderContent = {
  badgeLabel: "Funcionalidades principales",
  title: "Todo lo que necesitas para cobrar tus rentas sin estrés",
  lead:
    "Herramientas diseñadas para que los propietarios y administradores tengan control absoluto de su tiempo e ingresos.",
  cta: { label: "Comenzar gratis", href: "/auth" } satisfies LandingCta,
} as const;

export const landingFaqApproaches: LandingFaqApproach[] = [
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

export const landingFaqTagsHeading = "Pilares" as const;

export const landingCtaContent = {
  badgeLabel: "Empieza hoy",
  titleLine1: "¿Listo para cobrar",
  titleLine2: "tus rentas a tiempo?",
  primaryCta: { label: "Crear cuenta gratis", href: "/auth" } satisfies LandingCta,
  secondaryCta: { label: "Ver demo", href: "/howitworks" } satisfies LandingCta,
} as const;

export const landingFooterContent = {
  brandName: "Reentwise",
  addressHeading: "Dirección",
  addressLine: "Ciudad de México, México",
  columns: [
    {
      heading: "Navegación",
      links: [
        { label: "Cómo funciona", href: "/howitworks" },
        { label: "Testimonios", href: "/testimonials" },
        { label: "Precios", href: "/pricing" },
      ],
    },
    {
      heading: "Información",
      links: [
        { label: "Preguntas frecuentes", href: "/#services" },
        { label: "Contacto", href: "#" },
        { label: "Política de privacidad", href: "#" },
        { label: "Términos de servicio", href: "#" },
      ],
    },
    {
      heading: "Redes sociales",
      links: [
        { label: "Instagram", href: "#" },
        { label: "LinkedIn", href: "#" },
        { label: "Twitter (X)", href: "#" },
      ],
    },
  ] satisfies LandingFooterColumn[],
} as const;
