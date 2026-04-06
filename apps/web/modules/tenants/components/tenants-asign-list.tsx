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
import { IconBuilding, IconDoor } from "@tabler/icons-react";
import { toast } from "sonner";

type TenantAssignRow = {
  id: string;
  name: string;
  whatsapp: string;
  roomId: string | null;
  paymentDay: number;
};

export function TenantsAsignList({ roomId }: { roomId: string }) {
  const { data: tenants, isLoading, isError } = useTenantsQuery();
  const { mutate: reassignTenant, isPending } = useReassignTenant(roomId);

  // State for modals
  const [selectedTenant, setSelectedTenant] = useState<{
    id: string;
    roomId: string | null;
    paymentDay: number;
  } | null>(null);

  const [paymentDayInput, setPaymentDayInput] = useState<string>("1");

  if (isLoading) {
    return (
      <div className="flex justify-center p-4 text-sm text-muted-foreground">
        Cargando inquilinos...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center p-4 text-sm text-destructive">
        Error al cargar los inquilinos
      </div>
    );
  }

  const tenantsList: TenantAssignRow[] = tenants?.tenants ?? [];

  if (tenantsList.length === 0) {
    return (
      <div className="flex justify-center p-4 text-sm text-muted-foreground">
        No hay inquilinos registrados en tus propiedades.
      </div>
    );
  }

  const handleTenantClick = (tenant: TenantAssignRow) => {
    // If they already have a room, just open the warning Alert Dialog
    if (tenant.roomId) {
      setSelectedTenant({
        id: tenant.id,
        roomId: tenant.roomId,
        paymentDay: tenant.paymentDay,
      });
    } else {
      // If they don't have a room, open the Dialog to set their payment day
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

    const parsedDay = parseInt(paymentDayInput, 10);
    if (isNaN(parsedDay) || parsedDay < 0 || parsedDay > 31) {
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
              {tenant.roomId ? (
                <div className="flex items-center gap-1.5 text-xs text-primary mt-1">
                  <IconDoor className="size-3.5" />
                  <span>{tenant.roomId}</span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground mt-1 italic">
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

      {/* AlertDialog for tenants that ALREADY HAVE A ROOM */}
      <AlertDialog
        open={selectedTenant !== null && selectedTenant.roomId !== null}
        onOpenChange={(isOpen) => !isOpen && setSelectedTenant(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Mover Inquilino?</AlertDialogTitle>
            <AlertDialogDescription>
              Este inquilino ya está asignado a otro cuarto. Si continúas, será
              removido de su cuarto actual y asignado a este nuevo. Su
              configuración de fecha de pago se mantendrá.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={handleConfirmReassignWithRoom}
            >
              {isPending ? "Moviendo..." : "Mover Inquilino"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog for tenants that DO NOT HAVE A ROOM */}
      <Dialog
        open={selectedTenant !== null && selectedTenant.roomId === null}
        onOpenChange={(isOpen) => !isOpen && setSelectedTenant(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Inquilino</DialogTitle>
            <DialogDescription>
              Este inquilino no tiene ningún cuarto asignado. Por favor,
              confirma su día de pago para finalizar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="paymentDay">Día de Pago (0 = fin de mes)</Label>
              <Input
                id="paymentDay"
                type="number"
                min="0"
                max="31"
                value={paymentDayInput}
                onChange={(e) => setPaymentDayInput(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedTenant(null)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmReassignWithoutRoom}
              disabled={isPending}
            >
              {isPending ? "Asignando..." : "Confirmar Asignación"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
