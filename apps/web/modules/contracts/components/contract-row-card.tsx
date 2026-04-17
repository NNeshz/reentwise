"use client";

import { Card } from "@reentwise/ui/src/components/card";
import { Badge } from "@reentwise/ui/src/components/badge";
import { Button } from "@reentwise/ui/src/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reentwise/ui/src/components/dropdown-menu";
import {
  IconDotsVertical,
  IconPencil,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import type { ContractListRow } from "@/modules/contracts/types/contracts.types";
import {
  CONTRACT_STATUS_LABELS,
  CONTRACT_STATUS_BADGE_CLASS,
  formatContractCurrency,
  formatContractDate,
} from "@/modules/contracts/lib/contract-display";

export type ContractRowAction = "edit" | "activate" | "terminate";

type DialogTarget = {
  row: ContractListRow;
  action: ContractRowAction;
};

type Props = {
  row: ContractListRow;
  onAction: (target: DialogTarget) => void;
};

export function ContractRowCard({ row, onAction }: Props) {
  const { contract, tenant, room, property } = row;
  const statusLabel = CONTRACT_STATUS_LABELS[contract.status] ?? contract.status;
  const statusClass = CONTRACT_STATUS_BADGE_CLASS[contract.status] ?? CONTRACT_STATUS_BADGE_CLASS.draft;

  const canActivate = contract.status === "draft";
  const canTerminate = contract.status === "active" || contract.status === "renewed";

  return (
    <Card className="overflow-hidden p-0 transition-colors">
      <div className="flex items-center gap-4 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <span className="text-xs font-semibold text-muted-foreground">
            {tenant.name.slice(0, 2).toUpperCase()}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">
              {tenant.name}
            </p>
            <Badge className={`shrink-0 text-[10px] ${statusClass}`}>
              {statusLabel}
            </Badge>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
            <span className="truncate">{property.name} · Hab. {room.roomNumber}</span>
            <span>
              {formatContractDate(contract.startsAt)}
              {" → "}
              {contract.endsAt ? formatContractDate(contract.endsAt) : "Sin fecha fin"}
            </span>
          </div>
        </div>

        <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
          {formatContractCurrency(contract.rentAmount)}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-muted-foreground"
            >
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() => onAction({ row, action: "edit" })}
              >
                <IconPencil className="size-4" />
                Editar contrato
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {(canActivate || canTerminate) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {canActivate && (
                    <DropdownMenuItem
                      onSelect={() => onAction({ row, action: "activate" })}
                    >
                      <IconCheck className="size-4" />
                      Activar
                    </DropdownMenuItem>
                  )}
                  {canTerminate && (
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() => onAction({ row, action: "terminate" })}
                    >
                      <IconX className="size-4" />
                      Terminar
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
