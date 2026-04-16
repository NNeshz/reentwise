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
import { IconUserPlus } from "@tabler/icons-react"
import { TenantsAsignList } from "./tenants-asign-list"

export function TenantsAsign({
  roomId,
  nestedInSheet = false,
}: {
  roomId: string
  nestedInSheet?: boolean
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={!nestedInSheet}>
      <SheetTrigger asChild>
        <Button variant="outline" type="button" className="w-full">
          <IconUserPlus /> Asignar inquilino
        </Button>
      </SheetTrigger>
      <SheetContent
        nested={nestedInSheet}
        className="!block w-full overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle>Asignar inquilino</SheetTitle>
          <SheetDescription>
            Asigna un inquilino existente a esta habitación.
          </SheetDescription>
        </SheetHeader>
        {open && <TenantsAsignList roomId={roomId} />}
      </SheetContent>
    </Sheet>
  )
}
