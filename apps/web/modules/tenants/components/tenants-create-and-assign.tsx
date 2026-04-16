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
import { useCreateAndAssignTenant } from "@/modules/tenants/hooks/use-tenants"
import {
  TenantsCreateAndAssignForm,
  type CreateAndAssignData,
} from "./tenants-create-and-assign-form"

export function TenantsCreateAndAssign({
  roomId,
  roomPrice,
  nestedInSheet = false,
}: {
  roomId: string
  roomPrice?: number
  nestedInSheet?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const formId = React.useId()
  const createAndAssign = useCreateAndAssignTenant(roomId)

  const handleSubmit = async (data: CreateAndAssignData) => {
    await createAndAssign.mutateAsync(data)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={!nestedInSheet}>
      <SheetTrigger asChild>
        <Button type="button" className="w-full">
          <IconPlus /> Crear inquilino
        </Button>
      </SheetTrigger>
      <SheetContent
        nested={nestedInSheet}
        className="flex h-full max-h-dvh w-full flex-col sm:max-w-lg"
      >
        <SheetHeader className="shrink-0">
          <SheetTitle>Agregar inquilino</SheetTitle>
          <SheetDescription>
            Crea y asigna un nuevo inquilino a esta habitación.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {open && (
            <TenantsCreateAndAssignForm
              formId={formId}
              roomPrice={roomPrice}
              onSubmit={handleSubmit}
              isPending={createAndAssign.isPending}
            />
          )}
        </div>

        <SheetFooter className="shrink-0 border-t flex-col gap-2 px-4 pb-4 pt-3">
          <Button
            type="submit"
            form={formId}
            className="w-full"
            disabled={createAndAssign.isPending}
          >
            {createAndAssign.isPending ? "Agregando..." : "Agregar inquilino"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
