"use client";

import { Button } from "@reentwise/ui/src/components/button";

export function OwnerProfileFormActions({
  isSaving,
  isDirty,
  onDiscard,
}: {
  isSaving: boolean;
  isDirty: boolean;
  onDiscard: () => void;
}) {
  return (
    <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={onDiscard}
        disabled={isSaving || !isDirty}
      >
        Descartar
      </Button>
      <Button type="submit" disabled={isSaving || !isDirty}>
        {isSaving ? "Guardando…" : "Guardar cambios"}
      </Button>
    </div>
  );
}
