"use client";

import { useState } from "react";
import { useContractsQuery, useActivateContract, useTerminateContract } from "@/modules/contracts/hooks/use-contracts";
import { useContractsFilters } from "@/modules/contracts/store/use-contracts-filters";
import type { ContractListRow } from "@/modules/contracts/types/contracts.types";
import { CONTRACTS_LIST_STACK_CLASS } from "@/modules/contracts/lib/contract-display";
import {
  ContractRowCard,
  type ContractRowAction,
} from "@/modules/contracts/components/contract-row-card";
import { ContractDetailSheet } from "@/modules/contracts/components/contract-detail-sheet";
import { ContractsListSkeleton } from "@/modules/contracts/components/contracts-list-skeleton";
import { ContractsListEmpty } from "@/modules/contracts/components/contracts-list-empty";
import { ContractsListError } from "@/modules/contracts/components/contracts-list-error";
import { ContractsPagination } from "@/modules/contracts/components/contracts-pagination";

type DialogTarget = {
  row: ContractListRow;
  action: ContractRowAction;
};

export function ContractsList() {
  const { data, isPending, error, refetch, isRefetching } = useContractsQuery();
  const { setPage } = useContractsFilters();
  const activateContract = useActivateContract();
  const terminateContract = useTerminateContract();

  const [dialogTarget, setDialogTarget] = useState<DialogTarget | null>(null);

  const contracts = data?.contracts ?? [];
  const pagination = data?.pagination;
  const activeRow = dialogTarget?.row ?? null;

  function closeDialog() {
    setDialogTarget(null);
  }

  function handleAction(target: DialogTarget) {
    if (target.action === "activate") {
      activateContract.mutate(target.row.contract.id);
      return;
    }
    if (target.action === "terminate") {
      terminateContract.mutate(target.row.contract.id);
      return;
    }
    setDialogTarget(target);
  }

  if (isPending) return <ContractsListSkeleton />;

  if (error) {
    return (
      <ContractsListError
        error={error}
        onRetry={() => void refetch()}
        isRetrying={isRefetching}
      />
    );
  }

  if (contracts.length === 0) return <ContractsListEmpty />;

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        {pagination?.totalItems ?? contracts.length} contrato{(pagination?.totalItems ?? contracts.length) !== 1 ? "s" : ""}
      </p>

      <ul className={CONTRACTS_LIST_STACK_CLASS} role="list">
        {contracts.map((row) => (
          <li key={row.contract.id}>
            <ContractRowCard row={row} onAction={handleAction} />
          </li>
        ))}
      </ul>

      {pagination && (
        <ContractsPagination
          pagination={pagination}
          onPrevious={() => setPage(pagination.currentPage - 1)}
          onNext={() => setPage(pagination.currentPage + 1)}
        />
      )}

      <ContractDetailSheet
        row={activeRow}
        open={dialogTarget?.action === "view"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      />
    </div>
  );
}
