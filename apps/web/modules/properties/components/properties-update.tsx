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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@reentwise/ui/src/components/drawer";

import { IconEdit, IconPlus } from "@tabler/icons-react";
import { useIsMobile } from "@reentwise/ui/src/hooks/use-mobile";
import { PropertiesUpdateForm } from "./properties-update-form";

export function PropertiesUpdate({
  propertyId,
  propertyName,
  propertyAddress,
}: {
  propertyId: string;
  propertyName: string;
  propertyAddress: string | null;
}) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>
            <IconEdit />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Editar propiedad</SheetTitle>
            <SheetDescription>
              Edita la propiedad para que puedas gestionarla.
            </SheetDescription>
          </SheetHeader>
          <PropertiesUpdateForm
            propertyId={propertyId}
            propertyName={propertyName}
            propertyAddress={propertyAddress}
            embedded
            onSuccess={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <IconEdit />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Editar propiedad</DrawerTitle>
          <DrawerDescription>
            Edita la propiedad para que puedas gestionarla.
          </DrawerDescription>
        </DrawerHeader>
        <PropertiesUpdateForm
          propertyId={propertyId}
          propertyName={propertyName}
          propertyAddress={propertyAddress}
          className="px-4"
          embedded
          onSuccess={() => setOpen(false)}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
