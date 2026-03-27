"use client";

import { m } from "framer-motion";
import { IconSparkles } from "@tabler/icons-react";
import { howItWorksHighlightsContent } from "../data";

export function HowItWorksHighlights() {
  const { sectionBadge, sectionLead, items } = howItWorksHighlightsContent;

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="inline-flex items-center gap-2 border border-border/50 bg-background px-3 py-1.5 rounded-full shadow-sm"
          >
            <IconSparkles className="w-4 h-4 text-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              {sectionBadge}
            </span>
          </m.div>
          <m.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-muted-foreground max-w-md md:text-right"
          >
            {sectionLead}
          </m.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <m.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border/50 bg-card p-8 flex flex-col gap-3 shadow-sm"
            >
              <span className="text-sm font-semibold text-primary">{item.label}</span>
              <p className="text-muted-foreground leading-relaxed">{item.body}</p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
