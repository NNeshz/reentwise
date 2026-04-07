import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import {
  TESTIMONIALS_HERO_SECTION,
  TESTIMONIALS_ROWS_STACK,
  TESTIMONIALS_SECTION,
} from "@/modules/testimonials/lib/testimonials-display";

/** Placeholder si los testimonios vinieran de API. No montado en la ruta actual. */
export function TestimonialsPageSkeleton() {
  return (
    <div aria-hidden>
      <section className={TESTIMONIALS_HERO_SECTION}>
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-4 py-24">
          <Skeleton className="h-9 w-40 rounded-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-6 w-[75%]" />
        </div>
      </section>
      <section className={TESTIMONIALS_SECTION}>
        <div className={TESTIMONIALS_ROWS_STACK}>
          <Skeleton className="h-80 w-full rounded-3xl" />
          <Skeleton className="h-80 w-full rounded-3xl" />
        </div>
      </section>
    </div>
  );
}
