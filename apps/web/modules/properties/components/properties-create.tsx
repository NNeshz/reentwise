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
import { PropertiesCreateForm, type PropertiesCreateFormHandle } from "./properties-create-form"

export function PropertiesCreate() {
  const [open, setOpen] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)
  const formRef = React.useRef<PropertiesCreateFormHandle>(null)
  const formId = React.useId()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <IconPlus /> Agregar propiedad
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Agregar propiedad</SheetTitle>
          <SheetDescription>
            Agrega una nueva propiedad para que puedas gestionarla.
          </SheetDescription>
        </SheetHeader>

        {open && (
          <div className="flex-1 overflow-y-auto">
            <PropertiesCreateForm
              ref={formRef}
              id={formId}
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
            {isPending ? "Agregando..." : "Agregar propiedad"}
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
