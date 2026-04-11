"use client";

import * as React from "react";
import { Button } from "@reentwise/ui/src/components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@reentwise/ui/src/components/sheet";

import { IconUserPlus } from "@tabler/icons-react";
import { TenantsAsignList } from "./tenants-asign-list";

type TenantsAsignProps = {
  roomId: string;
  /**
   * Dentro de otro Sheet (p. ej. detalle de habitación): evita bloqueo de Radix
   * con `modal={false}` y z-index mayor en el panel interno.
   */
  nestedInSheet?: boolean;
};

export function TenantsAsign({
  roomId,
  nestedInSheet = false,
}: TenantsAsignProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={!nestedInSheet}>
      <SheetTrigger asChild>
        <Button variant="outline" type="button" className="w-full">
          <IconUserPlus /> Asignar inquilino
        </Button>
      </SheetTrigger>
      <SheetContent nested={nestedInSheet} className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Asignar inquilino</SheetTitle>
          <SheetDescription>
            Asigna un inquilino a la habitación.
          </SheetDescription>
        </SheetHeader>
        <TenantsAsignList roomId={roomId} />
      </SheetContent>
    </Sheet>
  );
}
