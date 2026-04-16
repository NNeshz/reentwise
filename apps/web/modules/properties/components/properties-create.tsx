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
import { IconPlus } from "@tabler/icons-react"
import { PropertiesCreateForm } from "./properties-create-form"

export function PropertiesCreate() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <IconPlus /> Agregar propiedad
        </Button>
      </SheetTrigger>
      <SheetContent className="!block w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Agregar propiedad</SheetTitle>
          <SheetDescription>
            Agrega una nueva propiedad para que puedas gestionarla.
          </SheetDescription>
        </SheetHeader>
        {open && <PropertiesCreateForm onSuccess={() => setOpen(false)} />}
      </SheetContent>
    </Sheet>
  )
}
