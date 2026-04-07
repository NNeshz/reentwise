"use client";

import { useState } from "react";
import {
  useReassignTenant,
  useTenantsQuery,
} from "@/modules/tenants/hooks/use-tenants";
import { Card } from "@reentwise/ui/src/components/card";
import { Avatar, AvatarFallback } from "@reentwise/ui/src/components/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@reentwise/ui/src/components/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@reentwise/ui/src/components/dialog";
import { Button } from "@reentwise/ui/src/components/button";
import { Label } from "@reentwise/ui/src/components/label";
import { Input } from "@reentwise/ui/src/components/input";
import { IconDoor } from "@tabler/icons-react";
import { toast } from "sonner";
import type { TenantListRow } from "@/modules/tenants/types/tenants.types";
import { TenantsAsignListSkeleton } from "@/modules/tenants/components/tenants-asign-list-skeleton";
import { TenantsAsignListError } from "@/modules/tenants/components/tenants-asign-list-error";

export function TenantsAsignList({ roomId }: { roomId: string }) {
  const {
    data,
    isPending,
    error,
    refetch,
    isRefetching,
  } = useTenantsQuery();
  const { mutate: reassignTenant, isPending: isReassigning } =
    useReassignTenant(roomId);

  const [selectedTenant, setSelectedTenant] = useState<{
    id: string;
    roomId: string | null;
    paymentDay: number;
  } | null>(null);

  const [paymentDayInput, setPaymentDayInput] = useState<string>("1");

  if (isPending) {
    return <TenantsAsignListSkeleton />;
  }

  if (error) {
    return (
      <TenantsAsignListError
        error={error}
        onRetry={() => void refetch()}
        isRetrying={isRefetching}
      />
    );
  }

  const tenantsList: TenantListRow[] = data?.tenants ?? [];

  if (tenantsList.length === 0) {
    return (
      <div className="flex justify-center p-4 text-sm text-muted-foreground">
        No hay inquilinos registrados en tus propiedades.
      </div>
    );
  }

  const handleTenantClick = (tenant: TenantListRow) => {
    if (tenant.roomId) {
      setSelectedTenant({
        id: tenant.id,
        roomId: tenant.roomId,
        paymentDay: tenant.paymentDay,
      });
    } else {
      setSelectedTenant({
        id: tenant.id,
        roomId: null,
        paymentDay: tenant.paymentDay,
      });
      setPaymentDayInput(tenant.paymentDay.toString());
    }
  };

  const handleConfirmReassignWithRoom = () => {
    if (!selectedTenant) return;

    reassignTenant(
      { tenantId: selectedTenant.id },
      {
        onSuccess: () => {
          setSelectedTenant(null);
        },
      },
    );
  };

  const handleConfirmReassignWithoutRoom = () => {
    if (!selectedTenant) return;

    const parsedDay = Number.parseInt(paymentDayInput, 10);
    if (Number.isNaN(parsedDay) || parsedDay < 0 || parsedDay > 31) {
      toast.error("El día de pago debe ser entre 0 y 31.");
      return;
    }

    reassignTenant(
      { tenantId: selectedTenant.id, paymentDay: parsedDay },
      {
        onSuccess: () => {
          setSelectedTenant(null);
        },
      },
    );
  };

  const roomLabel = (tenant: TenantListRow) => {
    if (tenant.room?.roomNumber) return `Hab. ${tenant.room.roomNumber}`;
    if (tenant.roomId) return "Cuarto asignado";
    return null;
  };

  return (
    <div className="mt-4 space-y-3">
      {tenantsList.map((tenant) => (
        <Card
          key={tenant.id}
          className="cursor-pointer transition-colors hover:bg-accent/50"
          onClick={() => handleTenantClick(tenant)}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="truncate font-medium">{tenant.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {tenant.whatsapp}
              </span>
              {roomLabel(tenant) ? (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-primary">
                  <IconDoor className="size-3.5" />
                  <span>{roomLabel(tenant)}</span>
                </div>
              ) : (
                <span className="mt-1 text-xs italic text-muted-foreground">
                  Sin cuarto asignado
                </span>
              )}
            </div>
            <Avatar className="h-10 w-10 border">
              <AvatarFallback className="bg-primary/10 text-primary">
                {tenant.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </Card>
      ))}

      <AlertDialog
        open={selectedTenant !== null && selectedTenant.roomId !== null}
        onOpenChange={(isOpen) => !isOpen && setSelectedTenant(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Mover inquilino?</AlertDialogTitle>
            <AlertDialogDescription>
              Este inquilino ya está asignado a otro cuarto. Si continúas, será
              removido de su cuarto actual y asignado a este. Su día de pago se
              mantendrá.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isReassigning}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isReassigning}
              onClick={handleConfirmReassignWithRoom}
            >
              {isReassigning ? "Moviendo..." : "Mover inquilino"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={selectedTenant !== null && selectedTenant.roomId === null}
        onOpenChange={(isOpen) => !isOpen && setSelectedTenant(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar inquilino</DialogTitle>
            <DialogDescription>
              Este inquilino no tiene cuarto asignado. Confirma su día de pago
              para finalizar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="paymentDay">Día de pago (0 = fin de mes)</Label>
              <Input
                id="paymentDay"
                type="number"
                min={0}
                max={31}
                value={paymentDayInput}
                onChange={(e) => setPaymentDayInput(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedTenant(null)}
              disabled={isReassigning}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmReassignWithoutRoom}
              disabled={isReassigning}
            >
              {isReassigning ? "Asignando..." : "Confirmar asignación"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
