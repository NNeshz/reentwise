import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import {
  HIW_CHECKLIST_GRID,
  HIW_CHECKLIST_SECTION,
  HIW_CONTAINER,
  HIW_CTA_SECTION,
  HIW_HIGHLIGHTS_GRID,
  HIW_HERO_SECTION,
  HIW_INTRO_GRID,
  HIW_SECTION,
  HIW_STEPS_STACK,
} from "@/modules/howitworks/lib/howitworks-display";

/**
 * Placeholder de layout si en el futuro el contenido viene de red (`useQuery`).
 * La ruta actual no lo monta.
 */
export function HowItWorksPageSkeleton() {
  return (
    <div className="bg-background" aria-hidden>
      <section className={HIW_HERO_SECTION}>
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-6 py-20">
          <Skeleton className="h-9 w-48 rounded-full" />
          <Skeleton className="h-14 w-full max-w-2xl" />
          <Skeleton className="h-6 w-full max-w-xl" />
          <Skeleton className="h-12 w-40 rounded-full" />
        </div>
      </section>

      <section className={HIW_SECTION}>
        <div className={HIW_INTRO_GRID}>
          <Skeleton className="h-32 w-full lg:col-span-7" />
          <div className="space-y-4 lg:col-span-5">
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <section className={HIW_SECTION}>
        <div className={HIW_CONTAINER}>
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:justify-between">
            <Skeleton className="h-9 w-40 rounded-full" />
            <Skeleton className="h-16 w-full max-w-md md:ml-auto" />
          </div>
          <div className={HIW_HIGHLIGHTS_GRID}>
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </div>
        </div>
      </section>

      <section className={HIW_SECTION}>
        <div className={HIW_STEPS_STACK}>
          <Skeleton className="h-72 w-full rounded-3xl" />
          <Skeleton className="h-72 w-full rounded-3xl" />
        </div>
      </section>

      <section className={HIW_CHECKLIST_SECTION}>
        <div className={HIW_CHECKLIST_GRID}>
          <Skeleton className="min-h-[280px] rounded-3xl" />
          <div className="space-y-4 py-4">
            <Skeleton className="h-8 w-[75%]" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>
      </section>

      <section className={HIW_CTA_SECTION}>
        <Skeleton className="absolute inset-0" />
        <div className="relative z-10 mx-auto w-full max-w-4xl space-y-6 px-4">
          <Skeleton className="mx-auto h-16 w-full max-w-2xl" />
          <Skeleton className="mx-auto h-14 w-56 rounded-full" />
        </div>
      </section>
    </div>
  );
}
