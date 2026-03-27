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
import { useDeleteTenant } from "@/modules/tenants/hooks/use-tenants";

export function TenantDeleteDialog({
  tenantId,
  tenantName,
  open,
  onOpenChange,
}: {
  tenantId: string | null;
  tenantName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate, isPending } = useDeleteTenant();

  function handleConfirm() {
    if (!tenantId) return;
    mutate(tenantId, {
      onSuccess: () => onOpenChange(false),
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar a {tenantName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará el inquilino y toda
            su información asociada permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
