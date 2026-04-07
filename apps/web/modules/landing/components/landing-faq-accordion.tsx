"use client";

import { m } from "framer-motion";
import { Badge } from "@reentwise/ui/src/components/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@reentwise/ui/src/components/accordion";
import type { LandingFaqApproach } from "@/modules/landing/types/landing.types";
import { landingFaqTagsHeading } from "@/modules/landing/data";
import { landingFaqAccordionItemClassName } from "@/modules/landing/lib/landing-display";

type Props = {
  items: LandingFaqApproach[];
};

export function LandingFaqAccordion({ items }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <Accordion type="single" collapsible className="w-full space-y-4">
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className={landingFaqAccordionItemClassName()}
          >
            <AccordionTrigger className="py-8 hover:no-underline">
              <div className="flex items-center gap-8 md:gap-16">
                <span className="text-sm font-semibold text-muted-foreground">
                  {item.id}
                </span>
                <span className="font-host-grotesk text-2xl font-medium text-foreground md:text-3xl">
                  {item.title}
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pl-0 pt-2 text-base text-muted-foreground md:pl-26">
              <div className="flex flex-col gap-8 xl:flex-row xl:gap-16">
                <div className="max-w-md">
                  <p className="leading-relaxed">{item.description}</p>
                </div>

                <div className="flex flex-1 flex-col items-start border-t border-border/50 pt-6 xl:border-l xl:border-t-0 xl:pl-10 xl:pt-0">
                  <h4 className="mb-4 font-semibold text-foreground">
                    {landingFaqTagsHeading}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="rounded-full border-border/60 px-4 py-1.5 text-xs font-normal text-muted-foreground hover:bg-transparent"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </m.div>
  );
}
