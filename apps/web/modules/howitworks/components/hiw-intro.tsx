"use client";

import { m } from "framer-motion";
import { howItWorksIntroContent } from "../data";

export function HowItWorksIntro() {
  const { headline, body, tags } = howItWorksIntroContent;

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          className="lg:col-span-7"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-host-grotesk font-medium text-foreground leading-[1.15] text-balance">
            {headline}
          </h2>
        </m.div>
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-5 space-y-4"
        >
          <p className="text-lg text-muted-foreground leading-relaxed">{body}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium rounded-full border border-border/60 bg-card px-3 py-1.5 text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}
