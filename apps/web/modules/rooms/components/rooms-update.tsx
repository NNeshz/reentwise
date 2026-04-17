"use client"

import * as React from "react"
import { Button } from "@reentwise/ui/src/components/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@reentwise/ui/src/components/sheet"
import { IconEdit } from "@tabler/icons-react"
import { RoomsUpdateForm, type RoomsUpdateFormHandle } from "./rooms-update-form"
import { RoomsDelete } from "./rooms-delete"

export function RoomsUpdate({
  propertyId,
  roomId,
  roomNumber,
  price,
  notes,
}: {
  propertyId: string
  roomId: string
  roomNumber: string
  price: string | number | null
  notes: string
}) {
  const [open, setOpen] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)
  const formRef = React.useRef<RoomsUpdateFormHandle>(null)
  const formId = React.useId()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Editar habitación</SheetTitle>
          <SheetDescription>Actualiza los datos de esta habitación.</SheetDescription>
        </SheetHeader>

        {open && (
          <div className="flex-1 overflow-y-auto">
            <RoomsUpdateForm
              ref={formRef}
              id={formId}
              propertyId={propertyId}
              roomId={roomId}
              roomNumber={roomNumber}
              price={price}
              notes={notes}
              onSuccess={() => setOpen(false)}
              onPendingChange={setIsPending}
            />
          </div>
        )}

        <SheetFooter className="border-t pt-4">
          <Button
            type="submit"
            form={formId}
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
          <RoomsDelete
            propertyId={propertyId}
            roomId={roomId}
            onSuccess={() => setOpen(false)}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
