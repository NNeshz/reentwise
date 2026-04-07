import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import {
  LANDING_CONTAINER,
  LANDING_CTA_SECTION,
  LANDING_HERO_SECTION,
  LANDING_SECTION,
} from "@/modules/landing/lib/landing-display";

/** Placeholder si la landing pasara a datos remotos (`useQuery`). No usado hoy. */
export function LandingPageSkeleton() {
  return (
    <div className="min-h-screen bg-background" aria-hidden>
      <div className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4">
        <Skeleton className="h-14 w-full max-w-4xl rounded-full" />
      </div>

      <section className={LANDING_HERO_SECTION}>
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 py-32">
          <Skeleton className="h-40 w-full max-w-2xl" />
          <Skeleton className="h-6 w-full max-w-xl" />
          <div className="flex gap-4">
            <Skeleton className="h-14 w-40 rounded-full" />
            <Skeleton className="h-14 w-48 rounded-full" />
          </div>
        </div>
      </section>

      <section className={`${LANDING_SECTION} min-h-[40vh]`}>
        <Skeleton className="mx-auto h-32 w-full max-w-4xl" />
      </section>

      <section className={LANDING_SECTION}>
        <div className={`${LANDING_CONTAINER} space-y-8`}>
          <div className="grid gap-8 lg:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="aspect-square w-full rounded-3xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
        </div>
      </section>

      <section className={LANDING_CTA_SECTION}>
        <Skeleton className="absolute inset-0" />
        <Skeleton className="relative z-10 mx-auto mt-24 h-32 w-[min(100%,28rem)]" />
      </section>
    </div>
  );
}
