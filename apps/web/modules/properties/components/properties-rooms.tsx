"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@reentwise/ui/src/components/sheet";
import { RoomsList } from "@/modules/rooms/components/rooms-list";
import { PropertiesUpdate } from "@/modules/properties/components/properties-update";
import { RoomsCreate } from "@/modules/rooms/components/rooms-create";
import { useProperty } from "@/modules/properties/hooks/use-properties";
import { PropertiesSheetError } from "@/modules/properties/components/properties-sheet-error";
import { PropertiesSheetHeaderSkeleton } from "@/modules/properties/components/properties-sheet-header-skeleton";
import { formatPropertyAddress } from "@/modules/properties/lib/property-display";

type PropertiesRoomsProps = {
  propertyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PropertiesRooms({ propertyId, open, onOpenChange }: PropertiesRoomsProps) {
  const { data: property, isPending, error, refetch, isRefetching } =
    useProperty(propertyId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex h-full max-h-dvh w-full flex-col sm:max-w-lg">
        <SheetHeader className="shrink-0">
          {isPending ? (
            <>
              <SheetTitle className="sr-only">Cargando propiedad</SheetTitle>
              <PropertiesSheetHeaderSkeleton />
            </>
          ) : error ? (
            <>
              <SheetTitle className="sr-only">Error al cargar la propiedad</SheetTitle>
              <PropertiesSheetError
                error={error}
                onRetry={() => void refetch()}
                isRetrying={isRefetching}
              />
            </>
          ) : property ? (
            <div className="flex items-center space-x-4">
              <PropertiesUpdate
                nestedInSheet
                propertyId={propertyId}
                propertyName={property.name}
                propertyAddress={property.address}
              />
              <div>
                <SheetTitle>{property.name}</SheetTitle>
                <SheetDescription>
                  {formatPropertyAddress(property.address)}
                </SheetDescription>
              </div>
            </div>
          ) : (
            <div>
              <SheetTitle>Propiedad</SheetTitle>
              <SheetDescription>Sin datos</SheetDescription>
            </div>
          )}
        </SheetHeader>
        {!error && property ? (
          <div className="min-h-0 flex-1 overflow-hidden px-4">
            <RoomsList propertyId={propertyId} nestedInParentSheet />
          </div>
        ) : null}
        {!error && property ? (
          <SheetFooter className="shrink-0">
            <RoomsCreate nestedInSheet propertyId={propertyId} />
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
