"use client";

import { m } from "framer-motion";
import { HIW_INTRO_TAG_CLASS } from "@/modules/howitworks/lib/howitworks-display";

type Props = {
  body: string;
  tags: readonly string[];
};

export function HowItWorksIntroAside({ body, tags }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: 0.1 }}
      className="space-y-4 lg:col-span-5"
    >
      <p className="text-lg leading-relaxed text-muted-foreground">{body}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className={HIW_INTRO_TAG_CLASS}>
            {tag}
          </span>
        ))}
      </div>
    </m.div>
  );
}
