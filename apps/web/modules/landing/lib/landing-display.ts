import { cn } from "@reentwise/ui/src/lib/utils";

export const LANDING_SECTION = "w-full bg-background px-4 py-24";

export const LANDING_CONTAINER = "mx-auto w-full max-w-6xl";

export const LANDING_HERO_SECTION =
  "relative flex h-screen min-h-[600px] w-full flex-col justify-end overflow-hidden px-4 pb-24";

export const LANDING_CTA_SECTION =
  "relative flex h-[65vh] min-h-[600px] w-full flex-col justify-end overflow-hidden px-4 pb-24";

export const LANDING_FAQ_SECTION_ID = "services";

export function landingStatCardClassName(): string {
  return cn(
    "flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-6 shadow-sm md:flex-row md:items-center md:p-8",
  );
}

export function landingFaqAccordionItemClassName(): string {
  return cn(
    "overflow-hidden rounded-2xl border border-border/50 bg-card px-6 shadow-sm sm:px-10",
    "data-[state=open]:pb-6",
  );
}
