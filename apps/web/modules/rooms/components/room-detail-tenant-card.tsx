"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@reentwise/ui/src/components/card";
import { IconUser } from "@tabler/icons-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@reentwise/ui/src/components/alert-dialog";
import { Button } from "@reentwise/ui/src/components/button";
import { useUnassignTenant } from "@/modules/tenants/hooks/use-tenants";
import type { RoomTenantSummary } from "@/modules/rooms/types/rooms.types";

type Props = {
  roomId: string;
  tenant: RoomTenantSummary;
};

export function RoomDetailTenantCard({ roomId, tenant }: Props) {
  const { mutate: unassignTenant, isPending: isUnassigning } =
    useUnassignTenant();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleUnassign = () => {
    unassignTenant(
      { roomId, tenantId: tenant.id },
      {
        onSuccess: () => setIsAlertOpen(false),
      },
    );
  };

  return (
    <Card className="rounded-xl border-primary/20 bg-primary/5 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary-figure">
            <IconUser className="size-4" stroke={2} />
          </span>
          Inquilino actual
        </CardTitle>

        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Desvincular
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Desvincular inquilino?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción removerá a {tenant.name} de la habitación, dejándola
                disponible (vacant). El inquilino seguirá en tu base de datos sin
                cuarto asignado.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isUnassigning}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleUnassign();
                }}
                disabled={isUnassigning}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isUnassigning ? "Desvinculando..." : "Sí, desvincular"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Nombre:</span> {tenant.name}
          </p>
          <p>
            <span className="font-semibold">WhatsApp:</span> {tenant.whatsapp}
          </p>
          <p>
            <span className="font-semibold">Día de pago:</span>{" "}
            {tenant.paymentDay === 0 ? "Fin de mes" : tenant.paymentDay}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
