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
import { PropertiesCreateForm } from "./properties-create-form"

export function PropertiesCreate() {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()

  if (!isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button><IconPlus /> Agregar propiedad</Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Agregar propiedad</SheetTitle>
            <SheetDescription>
              Agrega una nueva propiedad para que puedas gestionarla.
            </SheetDescription>
          </SheetHeader>
          <PropertiesCreateForm
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
        ><IconPlus /> Agregar propiedad</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Agregar propiedad</DrawerTitle>
          <DrawerDescription>
            Agrega una nueva propiedad para que puedas gestionarla.
          </DrawerDescription>
        </DrawerHeader>
        <PropertiesCreateForm
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
