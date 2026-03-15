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
import { TenantsCreateAndAssignForm } from "./tenants-create-and-assign-form"

export function TenantsCreateAndAssign({ roomId, roomPrice }: { roomId: string, roomPrice?: number }) {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()

  if (!isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button><IconPlus /> Crear inquilino</Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Agregar inquilino</SheetTitle>
            <SheetDescription>
              Agrega un nuevo inquilino para que puedas gestionarlo.
            </SheetDescription>
          </SheetHeader>
          <TenantsCreateAndAssignForm
            roomId={roomId}
            roomPrice={roomPrice}
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
        ><IconPlus /> Crear inquilino</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Crear inquilino</DrawerTitle>
          <DrawerDescription>
            Agrega un nuevo inquilino para que puedas gestionarlo.
          </DrawerDescription>
        </DrawerHeader>
        <TenantsCreateAndAssignForm
          roomId={roomId}
          roomPrice={roomPrice}
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
