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
import { RoomsUpdateForm } from "./rooms-update-form"

export function RoomsUpdate({
  propertyId,
  roomId,
  roomNumber,
  price,
  notes,
  nestedInSheet = false,
}: {
  propertyId: string
  roomId: string
  roomNumber: string
  price: string
  notes: string
  nestedInSheet?: boolean
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={!nestedInSheet}>
      <SheetTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-label="Editar habitación"
        >
          <IconEdit />
        </Button>
      </SheetTrigger>
      <SheetContent
        nested={nestedInSheet}
        className="!block w-full overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle>Editar habitación</SheetTitle>
          <SheetDescription>Actualiza los datos de esta habitación.</SheetDescription>
        </SheetHeader>
        {open && (
          <RoomsUpdateForm
            propertyId={propertyId}
            roomId={roomId}
            roomNumber={roomNumber}
            price={price}
            notes={notes}
            onSuccess={() => setOpen(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
