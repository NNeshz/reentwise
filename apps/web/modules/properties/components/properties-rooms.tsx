"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@reentwise/ui/src/components/sheet";
import { RoomsList } from "@/modules/rooms/components/rooms-list";
import { RoomsFilters } from "@/modules/rooms/components/rooms-filters";
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
      <SheetContent className="flex w-full flex-col sm:max-w-lg" showCloseButton={true}>
        <SheetHeader>
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
          <>
            <div className="px-4">
              <RoomsFilters propertyId={propertyId} />
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <RoomsList propertyId={propertyId} />
            </div>
            <SheetFooter className="border-t pt-4">
              <RoomsCreate propertyId={propertyId} />
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
