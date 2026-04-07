"use client";

import { Button } from "@reentwise/ui/src/components/button";
import {
  useAuditsFilters,
  AUDITS_FILTERS_DEFAULT_LIMIT,
} from "@/modules/audits/store/use-audits-filters";
import { useAuditFilterTenants } from "@/modules/audits/hooks/use-audit-filter-tenants";
import { AuditTenantFilter } from "@/modules/audits/components/filters/audit-tenant-filter";
import { AuditChannelFilter } from "@/modules/audits/components/filters/audit-channel-filter";
import { AuditStatusFilter } from "@/modules/audits/components/filters/audit-status-filter";
import { AuditLimitFilter } from "@/modules/audits/components/filters/audit-limit-filter";
import { IconFilterOff } from "@tabler/icons-react";

export function AuditsFilters() {
  const {
    tenantId,
    channel,
    status,
    limit,
    setTenantId,
    setChannel,
    setStatus,
    setLimit,
    resetFilters,
  } = useAuditsFilters();

  const tenantsQuery = useAuditFilterTenants();
  const tenants = tenantsQuery.data?.tenants ?? [];

  const hasActiveFilters =
    !!tenantId ||
    !!channel ||
    !!status ||
    limit !== AUDITS_FILTERS_DEFAULT_LIMIT;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex min-w-0 flex-1 flex-wrap gap-2">
        <AuditTenantFilter
          value={tenantId}
          onValueChange={setTenantId}
          tenants={tenants}
          isLoading={tenantsQuery.isPending}
          error={tenantsQuery.isError ? tenantsQuery.error : null}
          onRetry={() => void tenantsQuery.refetch()}
          isRetrying={tenantsQuery.isFetching && !tenantsQuery.isPending}
        />

        <AuditChannelFilter value={channel} onValueChange={setChannel} />

        <AuditStatusFilter value={status} onValueChange={setStatus} />

        <AuditLimitFilter value={limit} onValueChange={setLimit} />
      </div>

      {hasActiveFilters && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={() => resetFilters()}
        >
          <IconFilterOff className="size-4" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
