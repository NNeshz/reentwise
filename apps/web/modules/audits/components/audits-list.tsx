"use client";

import { useAuditsQuery } from "@/modules/audits/hooks/use-audits";
import { useAuditsFilters } from "@/modules/audits/store/use-audits-filters";
import { AuditsListSkeleton } from "@/modules/audits/components/audits-list-skeleton";
import { AuditsListEmpty } from "@/modules/audits/components/audits-list-empty";
import { AuditsListError } from "@/modules/audits/components/audits-list-error";
import { AuditsListFrame } from "@/modules/audits/components/audits-list-frame";
import { AuditsTableHeader } from "@/modules/audits/components/audits-table-header";
import { AuditRow } from "@/modules/audits/components/audit-row";
import { AuditsResultSummary } from "@/modules/audits/components/audits-result-summary";
import { AuditsPagination } from "@/modules/audits/components/audits-pagination";

export function AuditsList() {
  const { page, setPage } = useAuditsFilters();
  const { data, isPending, error, isFetching, refetch, isRefetching } =
    useAuditsQuery();

  const audits = data?.audits ?? [];
  const pagination = data?.pagination;

  if (isPending) {
    return <AuditsListSkeleton />;
  }

  if (error) {
    return (
      <AuditsListError
        error={error}
        onRetry={() => void refetch()}
        isRetrying={isRefetching}
      />
    );
  }

  if (audits.length === 0) {
    return <AuditsListEmpty />;
  }

  return (
    <div className="space-y-2">
      <AuditsResultSummary
        totalItems={pagination?.totalItems ?? 0}
        isFetching={isFetching}
        failedCount={data?.failedCount}
      />

      <AuditsListFrame>
        <AuditsTableHeader />
        <ul className="flex flex-col gap-1" role="list">
          {audits.map((row) => (
            <AuditRow key={row.id} row={row} />
          ))}
        </ul>
      </AuditsListFrame>

      {pagination ? (
        <AuditsPagination
          pagination={pagination}
          onPrevious={() => setPage(page - 1)}
          onNext={() => setPage(page + 1)}
        />
      ) : null}
    </div>
  );
}
