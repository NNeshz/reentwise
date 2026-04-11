import type {
  PricingHeroContent,
  PricingPlan,
  PricingPlanId,
} from "@/modules/pricing/types/pricing.types";

export type { PricingPlan, PricingPlanId } from "@/modules/pricing/types/pricing.types";

export const pricingHeroContent: PricingHeroContent = {
  badge: "Precios claros",
  title: "Planes simples, en pesos mexicanos",
  description:
    "Elige según cuántos cuartos administras. Facturación mensual, sin sorpresas.",
};

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

/** Solo lectura estática: Next no inyecta `NEXT_PUBLIC_*` en el cliente con `process.env[clave]`. */
function trimPublicEnv(v: string | undefined): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}

/** UUID del producto Polar; debe coincidir con `POLAR_PRODUCT_*` en el backend. */
export function getPolarProductIdForPlan(id: PricingPlanId): string | undefined {
  const map: Record<PricingPlanId, string | undefined> = {
    basic: trimPublicEnv(process.env.NEXT_PUBLIC_POLAR_PRODUCT_BASICO),
    pro: trimPublicEnv(process.env.NEXT_PUBLIC_POLAR_PRODUCT_PRO),
    patron: trimPublicEnv(process.env.NEXT_PUBLIC_POLAR_PRODUCT_PATRON),
  };
  return map[id];
}
