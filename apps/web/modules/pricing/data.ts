export type PricingPlanId = "basic" | "pro" | "patron";

export type PricingPlan = {
  id: PricingPlanId;
  name: string;
  /** Precio en MXN por mes */
  priceMonthly: number;
  /** Resumen del alcance (cuartos / escala) */
  scope: string;
  /** Subtítulo corto del plan */
  tagline: string;
  /** Límites de escala (cuartos, inquilinos, etc.) */
  limitsLine: string;
  /** Qué incluye (viñetas positivas) */
  features: string[];
  /**
   * Solo si aplica: límites o exclusiones explícitas (p. ej. plan Básico sin automatizaciones disparadas por el usuario).
   */
  exclusions?: string[];
  /** Plan recomendado (destacado en UI) */
  recommended?: boolean;
};

export const pricingHeroContent = {
  badge: "Precios claros",
  title: "Planes simples, en pesos mexicanos",
  description:
    "Elige según cuántos cuartos administras. Facturación mensual, sin sorpresas.",
} as const;

export const pricingPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Básico",
    priceMonthly: 249,
    scope: "Para empezar",
    tagline: "Solo recordatorios programados — sin automatizaciones bajo demanda",
    limitsLine: "Hasta 5 cuartos · hasta 5 inquilinos",
    features: [
      "Recordatorios por fecha (cron)",
      "WhatsApp incluido",
      "Panel: propiedades, cuartos, cobros",
      "Historial de avisos",
      "Sin disparadores manuales ni reglas extra",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 499,
    scope: "En crecimiento",
    tagline: "Recordatorios + automatización completa",
    limitsLine: "6–15 cuartos · inquilinos acordes",
    recommended: true,
    features: [
      "Todo lo del Básico",
      "Automatizaciones y reglas configurables",
      "Disparadores bajo demanda",
      "Mejor seguimiento de pagos en panel",
      "Recibos y mensajes de cobro",
      "Soporte por chat",
    ],
  },
  {
    id: "patron",
    name: "Patrón",
    priceMonthly: 899,
    scope: "Mucho volumen",
    tagline: "Escala, reportes y prioridad",
    limitsLine: "16+ cuartos · alto volumen",
    features: [
      "Todo lo del Pro",
      "Reportes y vista multi-propiedad",
      "Prioridad en envíos",
      "Afinación de reglas en volumen",
      "Contacto para facturación y cuenta",
    ],
  },
];

export const pricingPlansCta = {
  label: "Comenzar",
  /** Tras login, volver a precios para completar el checkout */
  href: "/auth?next=/pricing" as const,
};

/** Misma convención que `STRIPE_PRICE_*` en el backend (IDs públicos de Stripe). */
export function getStripePriceIdForPlan(id: PricingPlanId): string | undefined {
  const map: Record<PricingPlanId, string | undefined> = {
    basic: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASICO,
    pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    patron: process.env.NEXT_PUBLIC_STRIPE_PRICE_PATRON,
  };
  return map[id];
}
