"use client"

import * as React from "react"
import { Button } from "@reentwise/ui/src/components/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@reentwise/ui/src/components/sheet"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@reentwise/ui/src/components/drawer"

import { IconPlus } from "@tabler/icons-react"
import { useIsMobile } from "@reentwise/ui/src/hooks/use-mobile"
import { RoomsCreateForm } from "./rooms-create-form"

export function RoomsCreate({ propertyId }: { propertyId: string }) {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()

  if (!isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button><IconPlus /> Agregar habitación</Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Agregar habitación</SheetTitle>
            <SheetDescription>
              Agrega una nueva habitación para que puedas gestionarla.
            </SheetDescription>
          </SheetHeader>
          <RoomsCreateForm
            propertyId={propertyId}
            embedded
            onSuccess={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className="w-full"
        ><IconPlus /> Agregar habitación</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Agregar habitación</DrawerTitle>
          <DrawerDescription>
            Agrega una nueva habitación para que puedas gestionarla.
          </DrawerDescription>
        </DrawerHeader>
        <RoomsCreateForm
          propertyId={propertyId}
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
  )
}
