"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@reentwise/ui/src/components/sheet";

import { RoomsList } from "@/modules/rooms/components/rooms-list";
import { PropertiesUpdate } from "./properties-update";
import { RoomsCreate } from "@/modules/rooms/components/rooms-create";
import { useProperty } from "@/modules/properties/hooks/use-properties";

interface PropertiesRoomsProps {
  propertyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PropertiesRooms({
  propertyId,
  open,
  onOpenChange,
}: PropertiesRoomsProps) {
  const { data: property, isLoading } = useProperty(propertyId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center space-x-4">
            {property && (
              <PropertiesUpdate
                propertyId={propertyId}
                propertyName={property.name || ""}
                propertyAddress={property.address || null}
              />
            )}
            <div>
              <SheetTitle>
                {isLoading ? "Cargando..." : (property?.name ?? "Propiedad")}
              </SheetTitle>
              <SheetDescription>
                {isLoading
                  ? "Obteniendo detalles..."
                  : (property?.address ?? "Sin dirección")}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-hidden px-4">
          <RoomsList propertyId={propertyId} />
        </div>
        <SheetFooter>
          <RoomsCreate propertyId={propertyId} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
