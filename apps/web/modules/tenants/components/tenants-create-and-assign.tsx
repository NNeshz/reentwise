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
import { useCreateAndAssignTenant } from "@/modules/tenants/hooks/use-tenants"
import {
  TenantsCreateAndAssignForm,
  type CreateAndAssignData,
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
      <SheetContent className="block! w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Agregar inquilino</SheetTitle>
          <SheetDescription>
            Crea y asigna un nuevo inquilino a esta habitación.
          </SheetDescription>
        </SheetHeader>
        {open && (
          <TenantsCreateAndAssignForm
            roomPrice={roomPrice}
            onSubmit={handleSubmit}
            isPending={createAndAssign.isPending}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
