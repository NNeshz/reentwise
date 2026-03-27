"use client";

import { testimonials } from "../data";
import { TestimonialRow } from "./testimonial-row";

type TestimonialsRowsProps = {
  items?: typeof testimonials;
};

export function TestimonialsRows({ items = testimonials }: TestimonialsRowsProps) {
  return (
    <section className="w-full px-4 py-20">
      <div className="mx-auto max-w-6xl space-y-24 md:space-y-32">
        {items.map((t, index) => (
          <TestimonialRow key={t.id} testimonial={t} index={index} />
        ))}
      </div>
    </section>
  );
}
