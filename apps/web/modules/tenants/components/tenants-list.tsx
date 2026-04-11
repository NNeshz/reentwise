"use client";

import { useState } from "react";
import { useTenantsQuery } from "@/modules/tenants/hooks/use-tenants";
import { useTenantsFilters } from "@/modules/tenants/store/use-tenants-filters";
import type { TenantListRow } from "@/modules/tenants/types/tenants.types";
import { TENANTS_LIST_STACK_CLASS } from "@/modules/tenants/lib/tenant-display";
import {
  TenantRowCard,
  type TenantRowAction,
} from "@/modules/tenants/components/tenant-row-card";
import { TenantDetailSheet } from "@/modules/tenants/components/tenant-detail-sheet";
import { TenantEditSheet } from "@/modules/tenants/components/tenant-edit-sheet";
import { TenantPaymentsSheet } from "@/modules/tenants/components/tenant-payments-sheet";
import { TenantDeleteDialog } from "@/modules/tenants/components/tenant-delete-dialog";
import { TenantUnassignDialog } from "@/modules/tenants/components/tenant-unassign-dialog";
import { TenantsListSkeleton } from "@/modules/tenants/components/tenants-list-skeleton";
import { TenantsListEmpty } from "@/modules/tenants/components/tenants-list-empty";
import { TenantsListError } from "@/modules/tenants/components/tenants-list-error";
import { TenantsResultSummary } from "@/modules/tenants/components/tenants-result-summary";
import { TenantsPagination } from "@/modules/tenants/components/tenants-pagination";

type DialogTarget = {
  tenant: TenantListRow;
  action: TenantRowAction;
};

export function TenantsList() {
  const { page, setPage } = useTenantsFilters();
  const {
    data,
    isPending,
    error,
    isFetching,
    refetch,
    isRefetching,
  } = useTenantsQuery();

  const [dialogTarget, setDialogTarget] = useState<DialogTarget | null>(null);

  const tenants = data?.tenants ?? [];
  const pagination = data?.pagination;
  const totalProducts = pagination?.totalProducts ?? 0;

  const activeTenant = dialogTarget?.tenant ?? null;

  function closeDialog() {
    setDialogTarget(null);
  }

  if (isPending) {
    return <TenantsListSkeleton />;
  }

  if (error) {
    return (
      <TenantsListError
        error={error}
        onRetry={() => void refetch()}
        isRetrying={isRefetching}
      />
    );
  }

  if (tenants.length === 0) {
    return <TenantsListEmpty />;
  }

  return (
    <div className="space-y-4">
      <TenantsResultSummary
        totalProducts={totalProducts}
        isFetching={isFetching && !isPending}
      />

      <ul className={TENANTS_LIST_STACK_CLASS} role="list">
        {tenants.map((tenant) => (
          <li key={tenant.id}>
            <TenantRowCard tenant={tenant} onAction={setDialogTarget} />
          </li>
        ))}
      </ul>

      {pagination ? (
        <TenantsPagination
          pagination={pagination}
          onPrevious={() => setPage(page - 1)}
          onNext={() => setPage(page + 1)}
        />
      ) : null}

      <TenantDetailSheet
        tenant={activeTenant}
        open={dialogTarget?.action === "details"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      />

      <TenantEditSheet
        tenant={activeTenant}
        open={dialogTarget?.action === "edit"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      />

      <TenantPaymentsSheet
        tenantId={activeTenant?.id ?? null}
        tenantName={activeTenant?.name ?? ""}
        open={dialogTarget?.action === "payments"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      />

      <TenantUnassignDialog
        tenantId={activeTenant?.id ?? null}
        tenantName={activeTenant?.name ?? ""}
        roomId={activeTenant?.roomId ?? null}
        roomNumber={activeTenant?.room?.roomNumber ?? ""}
        open={dialogTarget?.action === "unassign"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      />

      <TenantDeleteDialog
        tenantId={activeTenant?.id ?? null}
        tenantName={activeTenant?.name ?? ""}
        open={dialogTarget?.action === "delete"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      />
    </div>
  );
}
