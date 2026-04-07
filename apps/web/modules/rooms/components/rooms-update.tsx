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

import { IconEdit } from "@tabler/icons-react";
import { useIsMobile } from "@reentwise/ui/src/hooks/use-mobile";
import { RoomsUpdateForm } from "./rooms-update-form";

export function RoomsUpdate({
  propertyId,
  roomId,
  roomNumber,
  price,
  notes,
}: {
  propertyId: string;
  roomId: string;
  roomNumber: string;
  price: string;
  notes: string;
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
            <SheetTitle>Editar habitación</SheetTitle>
            <SheetDescription>
              Actualiza los datos de esta habitación.
            </SheetDescription>
          </SheetHeader>
          <RoomsUpdateForm
            propertyId={propertyId}
            roomId={roomId}
            roomNumber={roomNumber}
            price={price}
            notes={notes}
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
          <DrawerTitle>Editar habitación</DrawerTitle>
          <DrawerDescription>
            Actualiza los datos de esta habitación.
          </DrawerDescription>
        </DrawerHeader>
        <RoomsUpdateForm
          propertyId={propertyId}
          roomId={roomId}
          roomNumber={roomNumber}
          price={price}
          notes={notes}
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
