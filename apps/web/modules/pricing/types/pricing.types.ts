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

export type PricingHeroContent = {
  badge: string;
  title: string;
  description: string;
};
