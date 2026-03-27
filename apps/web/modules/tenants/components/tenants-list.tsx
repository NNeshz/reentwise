"use client";

import { useState } from "react";
import { useTenantsQuery } from "@/modules/tenants/hooks/use-tenants";
import { Card } from "@reentwise/ui/src/components/card";
import { Avatar, AvatarFallback } from "@reentwise/ui/src/components/avatar";
import { Button } from "@reentwise/ui/src/components/button";
import { Skeleton } from "@reentwise/ui/src/components/skeleton";
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
import { TenantDetailSheet } from "@/modules/tenants/components/tenant-detail-sheet";
import { TenantPaymentsSheet } from "@/modules/tenants/components/tenant-payments-sheet";
import { TenantDeleteDialog } from "@/modules/tenants/components/tenant-delete-dialog";
import { TenantUnassignDialog } from "@/modules/tenants/components/tenant-unassign-dialog";

type Tenant = {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  paymentDay: number;
  roomId: string | null;
  room: { id: string; roomNumber: string } | null;
};

type DialogTarget = {
  tenant: Tenant;
  action: "details" | "payments" | "unassign" | "delete";
};

function TenantCard({
  tenant,
  onAction,
}: {
  tenant: Tenant;
  onAction: (target: DialogTarget) => void;
}) {
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
              {hasRoom && (
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => onAction({ tenant, action: "unassign" })}
                >
                  <IconUnlink className="size-4" />
                  Desvincular
                </DropdownMenuItem>
              )}
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

function TenantCardSkeleton() {
  return (
    <Card className="p-0">
      <div className="flex items-center gap-4 p-4">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="size-8 rounded-md" />
      </div>
    </Card>
  );
}

export function TenantsList() {
  const { data, isLoading, error } = useTenantsQuery();
  const [dialogTarget, setDialogTarget] = useState<DialogTarget | null>(null);

  const tenants = (data?.tenants ?? []) as Tenant[];
  const pagination = data?.pagination;
  const totalProducts = pagination?.totalProducts ?? 0;

  const activeTenant = dialogTarget?.tenant ?? null;

  function closeDialog() {
    setDialogTarget(null);
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <TenantCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="text-sm font-medium text-destructive">
          Error al cargar inquilinos
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (tenants.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-16 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          No hay inquilinos que coincidan con los filtros
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Prueba ajustar la búsqueda o los filtros
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {totalProducts} inquilino{totalProducts !== 1 ? "s" : ""}
        </span>
      </div>
      <ul className="space-y-3" role="list">
        {tenants.map((tenant) => (
          <li key={tenant.id}>
            <TenantCard tenant={tenant} onAction={setDialogTarget} />
          </li>
        ))}
      </ul>

      <TenantDetailSheet
        tenant={activeTenant}
        open={dialogTarget?.action === "details"}
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
