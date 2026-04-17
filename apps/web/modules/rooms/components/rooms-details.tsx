"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@reentwise/ui/src/components/sheet";
import { Skeleton } from "@reentwise/ui/src/components/skeleton";
import { RoomsUpdate } from "@/modules/rooms/components/rooms-update";
import { TenantsCreateAndAssign } from "@/modules/tenants/components/tenants-create-and-assign";
import { TenantsAsign } from "@/modules/tenants/components/tenants-asign";
import { useRoom } from "@/modules/rooms/hooks/use-rooms";
import { RoomsDetailSheetError } from "@/modules/rooms/components/rooms-detail-sheet-error";
import { RoomsDetailSheetHeaderSkeleton } from "@/modules/rooms/components/rooms-detail-sheet-header-skeleton";
import { RoomDetailSummaryCard } from "@/modules/rooms/components/room-detail-summary-card";
import { RoomDetailTenantCard } from "@/modules/rooms/components/room-detail-tenant-card";

export function RoomsDetails({
  propertyId,
  roomId,
  children,
}: {
  propertyId: string;
  roomId: string;
  children: React.ReactNode;
}) {
  const { data: room, isPending, error, refetch, isRefetching } = useRoom(
    propertyId,
    roomId,
  );

  const activeTenant = room?.tenants?.[0];
  const roomPriceNum = room?.price ? Number(room.price) : undefined;
  const tenantCount = room?.tenants?.length ?? 0;
  const canAssignOrCreateTenant = tenantCount === 0;

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          {isPending ? (
            <>
              <SheetTitle className="sr-only">Cargando habitación</SheetTitle>
              <RoomsDetailSheetHeaderSkeleton />
            </>
          ) : error ? (
            <>
              <SheetTitle className="sr-only">Error al cargar habitación</SheetTitle>
              <RoomsDetailSheetError
                error={error}
                onRetry={() => void refetch()}
                isRetrying={isRefetching}
              />
            </>
          ) : room ? (
            <div className="flex items-center space-x-4">
              <RoomsUpdate
                propertyId={propertyId}
                roomId={roomId}
                roomNumber={room.roomNumber}
                price={room.price}
                notes={room.notes ?? ""}
              />
              <div>
                <SheetTitle>{room.roomNumber}</SheetTitle>
                <SheetDescription>
                  {tenantCount === 0
                    ? "Crea o asigna un inquilino a esta habitación."
                    : "Detalles de la habitación."}
                </SheetDescription>
              </div>
            </div>
          ) : (
            <div>
              <SheetTitle>Habitación</SheetTitle>
              <SheetDescription>Sin datos.</SheetDescription>
            </div>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {isPending ? (
            <Skeleton className="h-52 w-full rounded-xl" />
          ) : !error && room ? (
            <>
              <RoomDetailSummaryCard
                propertyId={propertyId}
                roomId={roomId}
                room={room}
              />
              {activeTenant ? (
                <RoomDetailTenantCard roomId={roomId} tenant={activeTenant} />
              ) : null}
            </>
          ) : null}
        </div>

        {!error && room && canAssignOrCreateTenant ? (
          <SheetFooter className="border-t pt-4 flex-col gap-2">
            <TenantsCreateAndAssign
              roomId={roomId}
              roomPrice={
                roomPriceNum !== undefined && Number.isFinite(roomPriceNum)
                  ? roomPriceNum
                  : undefined
              }
            />
            <TenantsAsign roomId={roomId} />
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
