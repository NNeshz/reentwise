import { cn } from "@reentwise/ui/src/lib/utils";
import type { TestimonialPlanId } from "@/modules/testimonials/types/testimonials.types";

export const TESTIMONIALS_ROWS_STACK =
  "mx-auto max-w-6xl space-y-24 md:space-y-32";

export const TESTIMONIALS_SECTION = "w-full px-4 py-20";

export const TESTIMONIALS_HERO_SECTION =
  "relative flex min-h-[42vh] w-full flex-col justify-end overflow-hidden px-4 pb-16 pt-28 md:min-h-[50vh]";

export function testimonialRowGridClassName(
  imageOnRight: boolean,
  isProFeatured: boolean,
): string {
  return cn(
    "grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16",
    !imageOnRight &&
      "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1",
    isProFeatured &&
      "rounded-3xl border border-primary/20 bg-card/50 p-6 shadow-sm md:p-10 lg:p-12",
  );
}

export function testimonialPlanBadgeClassName(planId: TestimonialPlanId): string {
  if (planId === "pro") {
    return "border-primary/50 bg-primary/10 text-primary";
  }
  if (planId === "patron") {
    return "border-foreground/20 bg-muted/60 text-foreground";
  }
  return "border-border/80 bg-muted/40 text-muted-foreground";
}

export function testimonialImageFrameClassName(): string {
  return "relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-border/40 shadow-sm";
}
