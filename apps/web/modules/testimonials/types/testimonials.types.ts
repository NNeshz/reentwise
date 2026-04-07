import type { TablerIcon } from "@tabler/icons-react";

export type TestimonialPlanId = "basic" | "pro" | "patron";

export type Testimonial = {
  id: string;
  /** Número visible en el layout (01, 02…) */
  stepIndex: string;
  name: string;
  /** Rol o situación (arrienda cuartos, etc.) */
  context: string;
  planId: TestimonialPlanId;
  /** Texto visible del plan, ej. "Plan Básico" */
  planName: string;
  quote: string;
  /** Dato corto de impacto (tiempo, estrés, etc.) */
  highlight: string;
  image: string;
  imageAlt: string;
  icon: TablerIcon;
};

export type TestimonialsHeroContent = {
  badge: string;
  title: string;
  description: string;
};
