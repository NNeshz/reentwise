"use client";

import { testimonials } from "@/modules/testimonials/data";
import {
  TESTIMONIALS_ROWS_STACK,
  TESTIMONIALS_SECTION,
} from "@/modules/testimonials/lib/testimonials-display";
import type { Testimonial } from "@/modules/testimonials/types/testimonials.types";
import { TestimonialRow } from "./testimonial-row";

type TestimonialsRowsProps = {
  items?: Testimonial[];
};

export function TestimonialsRows({ items = testimonials }: TestimonialsRowsProps) {
  return (
    <section className={TESTIMONIALS_SECTION}>
      <div className={TESTIMONIALS_ROWS_STACK}>
        {items.map((t, index) => (
          <TestimonialRow key={t.id} testimonial={t} index={index} />
        ))}
      </div>
    </section>
  );
}
