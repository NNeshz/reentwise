"use client";

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
import { useUnassignTenant } from "@/modules/tenants/hooks/use-tenants";

export function TenantUnassignDialog({
  tenantId,
  tenantName,
  roomId,
  roomNumber,
  open,
  onOpenChange,
}: {
  tenantId: string | null;
  tenantName: string;
  roomId: string | null;
  roomNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate, isPending } = useUnassignTenant();

  function handleConfirm() {
    if (!tenantId || !roomId) return;
    mutate(
      { roomId, tenantId },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Desvincular a {tenantName} de Hab. {roomNumber}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            El inquilino dejará de estar asignado a esta habitación. La
            habitación quedará marcada como vacante. El inquilino no será
            eliminado.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isPending}
          >
            {isPending ? "Desvinculando..." : "Desvincular"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
