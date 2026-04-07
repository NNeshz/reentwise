import { cn } from "@reentwise/ui/src/lib/utils";

/** Secciones estándar (padding horizontal + vertical). */
export const HIW_SECTION = "w-full py-20 px-4";

/** Contenedor centrado principal del módulo. */
export const HIW_CONTAINER = "max-w-6xl mx-auto";

export const HIW_HERO_SECTION =
  "relative flex min-h-dvh w-full flex-col justify-end overflow-hidden px-4 pb-20 pt-28";

export const HIW_INTRO_GRID = cn(
  HIW_CONTAINER,
  "grid grid-cols-1 items-center gap-12 lg:grid-cols-12",
);

export const HIW_INTRO_TAG_CLASS =
  "rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground";

export const HIW_HIGHLIGHTS_GRID =
  "grid grid-cols-1 gap-4 md:grid-cols-3";

export const HIW_HIGHLIGHT_CARD_CLASS =
  "flex flex-col gap-3 rounded-2xl border border-border/50 bg-card p-8 shadow-sm";

export const HIW_HIGHLIGHTS_BADGE_ROW =
  "inline-flex items-center gap-2 rounded-full border border-border/50 bg-background px-3 py-1.5 shadow-sm";

export const HIW_STEPS_STACK = cn(HIW_CONTAINER, "space-y-24 md:space-y-32");

export const HIW_STEP_ROW_GRID =
  "grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16";

export function hiwStepRowOrderClass(imageOnRight: boolean): string {
  return cn(
    HIW_STEP_ROW_GRID,
    !imageOnRight &&
      "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1",
  );
}

export const HIW_STEP_IMAGE_FRAME =
  "relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-border/40 shadow-sm";

export const HIW_CHECKLIST_SECTION =
  "w-full border-y border-border/40 bg-card/30 py-20 px-4";

export const HIW_CHECKLIST_GRID = cn(
  HIW_CONTAINER,
  "grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2",
);

export const HIW_CTA_SECTION =
  "relative flex min-h-[50dvh] w-full items-center justify-center overflow-hidden px-4 py-12";

/** Textura noise (misma URL en todo el marketing). */
export const HIW_NOISE_BG_IMAGE = 'url("/images/noise.webp")';
