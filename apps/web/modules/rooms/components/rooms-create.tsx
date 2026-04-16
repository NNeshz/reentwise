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
import { RoomsCreateForm } from "./rooms-create-form"

export function RoomsCreate({
  propertyId,
}: {
  propertyId: string
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <IconPlus /> Agregar habitación
        </Button>
      </SheetTrigger>
      <SheetContent className="!block w-full overflow-y-auto sm:max-w-lg">

        <SheetHeader>
          <SheetTitle>Agregar habitación</SheetTitle>
          <SheetDescription>
            Agrega una nueva habitación para que puedas gestionarla.
          </SheetDescription>
        </SheetHeader>
        {open && (
          <RoomsCreateForm propertyId={propertyId} onSuccess={() => setOpen(false)} />
        )}
      </SheetContent>
    </Sheet>
  )
}
