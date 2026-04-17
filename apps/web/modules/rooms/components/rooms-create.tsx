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
import { IconPlus } from "@tabler/icons-react"
import { RoomsCreateForm, type RoomsCreateFormHandle } from "./rooms-create-form"

export function RoomsCreate({ propertyId }: { propertyId: string }) {
  const [open, setOpen] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)
  const formRef = React.useRef<RoomsCreateFormHandle>(null)
  const formId = React.useId()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <IconPlus /> Agregar habitación
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Agregar habitación</SheetTitle>
          <SheetDescription>
            Agrega una nueva habitación para que puedas gestionarla.
          </SheetDescription>
        </SheetHeader>

        {open && (
          <div className="flex-1 overflow-y-auto">
            <RoomsCreateForm
              ref={formRef}
              id={formId}
              propertyId={propertyId}
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
            {isPending ? "Agregando..." : "Agregar habitación"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isPending}
            onClick={() => formRef.current?.reset()}
          >
            Limpiar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
