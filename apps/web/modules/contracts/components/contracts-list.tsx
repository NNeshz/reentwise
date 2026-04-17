"use client";

import { useState } from "react";
import { useContractsQuery, useActivateContract, useTerminateContract } from "@/modules/contracts/hooks/use-contracts";
import type { ContractListRow } from "@/modules/contracts/types/contracts.types";
import { CONTRACTS_LIST_STACK_CLASS } from "@/modules/contracts/lib/contract-display";
import {
  ContractRowCard,
  type ContractRowAction,
} from "@/modules/contracts/components/contract-row-card";
import { ContractEditSheet } from "@/modules/contracts/components/contract-edit-sheet";
import { ContractsListSkeleton } from "@/modules/contracts/components/contracts-list-skeleton";
import { ContractsListEmpty } from "@/modules/contracts/components/contracts-list-empty";
import { ContractsListError } from "@/modules/contracts/components/contracts-list-error";

type DialogTarget = {
  row: ContractListRow;
  action: ContractRowAction;
};

export function ContractsList() {
  const { data, isPending, error, refetch, isRefetching } = useContractsQuery();
  const activateContract = useActivateContract();
  const terminateContract = useTerminateContract();

  const [dialogTarget, setDialogTarget] = useState<DialogTarget | null>(null);

  const contracts = data ?? [];
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
        {contracts.length} contrato{contracts.length !== 1 ? "s" : ""}
      </p>

      <ul className={CONTRACTS_LIST_STACK_CLASS} role="list">
        {contracts.map((row) => (
          <li key={row.contract.id}>
            <ContractRowCard row={row} onAction={handleAction} />
          </li>
        ))}
      </ul>

      <ContractEditSheet
        row={activeRow}
        open={dialogTarget?.action === "edit"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      />
    </div>
  );
}
