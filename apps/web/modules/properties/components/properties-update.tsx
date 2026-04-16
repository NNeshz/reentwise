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
import { IconEdit } from "@tabler/icons-react"
import { PropertiesUpdateForm } from "./properties-update-form"

export function PropertiesUpdate({
  propertyId,
  propertyName,
  propertyAddress,
}: {
  propertyId: string
  propertyName: string
  propertyAddress: string | null
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label="Editar propiedad"
        >
          <IconEdit />
        </Button>
      </SheetTrigger>
      <SheetContent className="!block w-full overflow-y-auto sm:max-w-lg">

        <SheetHeader>
          <SheetTitle>Editar propiedad</SheetTitle>
          <SheetDescription>Actualiza los datos de la propiedad.</SheetDescription>
        </SheetHeader>
        {open && (
          <PropertiesUpdateForm
            propertyId={propertyId}
            propertyName={propertyName}
            propertyAddress={propertyAddress}
            onSuccess={() => setOpen(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
