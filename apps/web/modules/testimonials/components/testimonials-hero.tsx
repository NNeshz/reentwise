"use client";

import { testimonialsHeroContent } from "@/modules/testimonials/data";
import { TESTIMONIALS_HERO_SECTION } from "@/modules/testimonials/lib/testimonials-display";
import { TestimonialsHeroBackground } from "./testimonials-hero-background";
import { TestimonialsHeroBadge } from "./testimonials-hero-badge";
import { TestimonialsHeroCopy } from "./testimonials-hero-copy";

export function TestimonialsHero() {
  const c = testimonialsHeroContent;

  return (
    <section className={TESTIMONIALS_HERO_SECTION}>
      <TestimonialsHeroBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-5 text-center">
        <TestimonialsHeroBadge label={c.badge} />
        <TestimonialsHeroCopy title={c.title} description={c.description} />
      </div>
    </section>
  );
}
