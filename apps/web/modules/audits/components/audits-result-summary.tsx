"use client";

import { useAuditsFilters } from "@/modules/audits/store/use-audits-filters";

type Props = {
  totalItems: number;
  isFetching: boolean;
  failedCount?: number;
};

export function AuditsResultSummary({ totalItems, isFetching, failedCount }: Props) {
  const { status, setStatus } = useAuditsFilters();

  const showFailedBanner =
    typeof failedCount === "number" && failedCount > 0 && status !== "failed";

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
      <span>
        {totalItems} registro{totalItems !== 1 ? "s" : ""}
        {isFetching ? " · actualizando…" : ""}
      </span>

      {showFailedBanner && (
        <button
          type="button"
          onClick={() => setStatus("failed")}
          className="flex items-center gap-1 rounded-md border border-orange-300 bg-orange-50 px-2 py-0.5 font-medium text-orange-700 transition-colors hover:bg-orange-100 dark:border-orange-700/60 dark:bg-orange-900/20 dark:text-orange-300 dark:hover:bg-orange-900/30"
        >
          ⚠ {failedCount} fallido{failedCount !== 1 ? "s" : ""} · Ver
        </button>
      )}
    </div>
  );
}
