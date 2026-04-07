"use client";

import { Card } from "@reentwise/ui/src/components/card";
import { Avatar, AvatarFallback } from "@reentwise/ui/src/components/avatar";
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
  IconEye,
  IconCash,
  IconUnlink,
  IconTrash,
} from "@tabler/icons-react";
import type { TenantListRow } from "@/modules/tenants/types/tenants.types";

export type TenantRowAction =
  | "details"
  | "payments"
  | "unassign"
  | "delete";

type DialogTarget = {
  tenant: TenantListRow;
  action: TenantRowAction;
};

type Props = {
  tenant: TenantListRow;
  onAction: (target: DialogTarget) => void;
};

export function TenantRowCard({ tenant, onAction }: Props) {
  const hasRoom = !!tenant.roomId;

  return (
    <Card className="overflow-hidden p-0 transition-colors">
      <div className="flex items-center gap-4 p-4">
        <Avatar size="lg" className="h-10 w-10 shrink-0 border">
          <AvatarFallback className="bg-primary/10 text-sm text-primary">
            {tenant.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {tenant.name}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
            <span className="truncate">{tenant.email}</span>
            <span>{tenant.whatsapp}</span>
          </div>
        </div>

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
                onSelect={() => onAction({ tenant, action: "details" })}
              >
                <IconEye className="size-4" />
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => onAction({ tenant, action: "payments" })}
              >
                <IconCash className="size-4" />
                Ver pagos
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {hasRoom ? (
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => onAction({ tenant, action: "unassign" })}
                >
                  <IconUnlink className="size-4" />
                  Desvincular
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => onAction({ tenant, action: "delete" })}
              >
                <IconTrash className="size-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
