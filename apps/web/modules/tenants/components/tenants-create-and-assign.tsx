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
  type TenantsCreateAndAssignFormHandle,
} from "./tenants-create-and-assign-form"

export function TenantsCreateAndAssign({
  roomId,
  roomPrice,
}: {
  roomId: string
  roomPrice?: number
}) {
  const [open, setOpen] = React.useState(false)
  const createAndAssign = useCreateAndAssignTenant(roomId)
  const formRef = React.useRef<TenantsCreateAndAssignFormHandle>(null)
  const formId = React.useId()

  const handleSubmit = async (data: CreateAndAssignData) => {
    await createAndAssign.mutateAsync(data)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" className="w-full">
          <IconPlus /> Crear inquilino
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Agregar inquilino</SheetTitle>
          <SheetDescription>
            Crea y asigna un nuevo inquilino a esta habitación.
          </SheetDescription>
        </SheetHeader>

        {open && (
          <div className="flex-1 overflow-y-auto">
            <TenantsCreateAndAssignForm
              ref={formRef}
              id={formId}
              roomPrice={roomPrice}
              onSubmit={handleSubmit}
              isPending={createAndAssign.isPending}
            />
          </div>
        )}

        <SheetFooter className="border-t pt-4">
          <Button
            type="submit"
            form={formId}
            className="w-full"
            disabled={createAndAssign.isPending}
          >
            {createAndAssign.isPending ? "Agregando..." : "Agregar inquilino"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={createAndAssign.isPending}
            onClick={() => formRef.current?.reset()}
          >
            Limpiar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
