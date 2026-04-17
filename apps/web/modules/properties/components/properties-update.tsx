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
import { PropertiesUpdateForm, type PropertiesUpdateFormHandle } from "./properties-update-form"
import { PropertiesDelete } from "./properties-delete"

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
  const [isPending, setIsPending] = React.useState(false)
  const formRef = React.useRef<PropertiesUpdateFormHandle>(null)
  const formId = React.useId()

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
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Editar propiedad</SheetTitle>
          <SheetDescription>Actualiza los datos de la propiedad.</SheetDescription>
        </SheetHeader>

        {open && (
          <div className="flex-1 overflow-y-auto">
            <PropertiesUpdateForm
              ref={formRef}
              id={formId}
              propertyId={propertyId}
              propertyName={propertyName}
              propertyAddress={propertyAddress}
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
          <PropertiesDelete propertyId={propertyId} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
